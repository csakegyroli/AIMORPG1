import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import type { Request } from "express";
import { PrismaService } from "../prisma.service";
import { hashPassword, verifyPassword } from "./passwords";
import type { AuthenticatedRequestUser, SafeUser } from "./auth.types";

const SESSION_COOKIE = () => process.env.COOKIE_NAME || "aimorpg_session";
const SESSION_DAYS = () => Math.min(30, Math.max(1, Number(process.env.SESSION_DAYS || 7)));

export function digest(value: string): string { return createHash("sha256").update(value).digest("hex"); }
export function digestIp(ip?: string): string | null {
  if (!ip) return null;
  return digest(`${process.env.AUDIT_HASH_SECRET || "dev-only-change-me"}:${ip}`);
}

@Injectable()
export class AuthService implements OnModuleInit {
  private dummyHash = "";
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Used for unknown email addresses so failed logins still do a password-hash operation.
    this.dummyHash = await hashPassword(randomBytes(24).toString("hex"));
  }

  private cleanEmail(email: string) { return email.normalize("NFKC").trim().toLowerCase(); }
  private safe(user: { id: string; email: string; displayName: string; createdAt: Date; profile?: { preferredAvatar: string; publicProfile: boolean } | null }): SafeUser {
    return { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt, profile: user.profile ? { preferredAvatar: user.profile.preferredAvatar, publicProfile: user.profile.publicProfile } : null };
  }

  async register(input: { email: string; password: string; displayName: string }, request: Request) {
    if (Buffer.byteLength(input.password, "utf8") > 128) throw new ConflictException("A jelszó UTF-8 bájthossza legfeljebb 128 lehet.");
    const email = this.cleanEmail(input.email);
    const displayName = input.displayName.normalize("NFC").trim();
    const passwordHash = await hashPassword(input.password);
    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash, displayName, profile: { create: {} } },
        include: { profile: true },
      });
      const session = await this.createSession(user.id, request);
      await this.recordSecurityEvent(user.id, "account.registered", request, { channel: "password" });
      return { user: this.safe(user), token: session.token, expiresAt: session.expiresAt };
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "P2002") throw new ConflictException("Ezzel az e-mail-címmel már létezik fiók.");
      throw error;
    }
  }

  async login(input: { email: string; password: string }, request: Request) {
    const email = this.cleanEmail(input.email);
    const user = await this.prisma.user.findUnique({ where: { email }, include: { profile: true } });
    const hash = user?.passwordHash ?? this.dummyHash;
    const matched = await verifyPassword(input.password, hash);
    if (!user || !matched || user.disabledAt) {
      await this.recordSecurityEvent(user?.id ?? null, "auth.login_failed", request, { emailDigest: digest(email) });
      throw new UnauthorizedException("Az e-mail-cím vagy a jelszó nem megfelelő.");
    }
    const session = await this.createSession(user.id, request);
    await this.recordSecurityEvent(user.id, "auth.login_succeeded", request, { channel: "password" });
    return { user: this.safe(user), token: session.token, expiresAt: session.expiresAt };
  }

  async validateSession(token: string): Promise<AuthenticatedRequestUser | null> {
    const tokenHash = digest(token);
    const session = await this.prisma.session.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() }, user: { disabledAt: null } },
      select: { id: true, userId: true, user: { select: { id: true, email: true, displayName: true, createdAt: true } } },
    });
    if (!session) return null;
    // Avoid a write on every API call; touch the session at most once every five minutes.
    const sessionState = await this.prisma.session.findUnique({ where: { id: session.id }, select: { lastSeenAt: true } });
    if (sessionState && Date.now() - sessionState.lastSeenAt.getTime() > 5 * 60_000) {
      await this.prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
    }
    return session.user;
  }

  async logout(token: string | undefined, request: Request) {
    if (token && token.length <= 128) {
      const tokenHash = digest(token);
      const session = await this.prisma.session.findUnique({ where: { tokenHash }, select: { id: true, userId: true } });
      if (session) {
        await this.prisma.session.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
        await this.recordSecurityEvent(session.userId, "auth.logout", request, {});
      }
    }
  }

  async activeSecuritySummary(userId: string) {
    const [sessions, recentEvents] = await Promise.all([
      this.prisma.session.count({ where: { userId, revokedAt: null, expiresAt: { gt: new Date() } } }),
      this.prisma.securityEvent.findMany({ where: { userId, eventType: { in: ["auth.login_succeeded", "auth.login_failed", "auth.logout", "account.registered"] } }, orderBy: { createdAt: "desc" }, take: 8, select: { eventType: true, createdAt: true } }),
    ]);
    return { activeSessions: sessions, recentEvents };
  }

  private async createSession(userId: string, request: Request) {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_DAYS() * 24 * 60 * 60 * 1000);
    const oldSessions = await this.prisma.session.findMany({ where: { userId, revokedAt: null, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "asc" }, select: { id: true } });
    if (oldSessions.length >= 5) {
      const toRevoke = oldSessions.slice(0, oldSessions.length - 4).map((session) => session.id);
      await this.prisma.session.updateMany({ where: { id: { in: toRevoke } }, data: { revokedAt: new Date() } });
    }
    await this.prisma.session.create({ data: {
      userId, tokenHash: digest(token), expiresAt,
      userAgent: String(request.headers["user-agent"] ?? "").slice(0, 240) || null,
    } });
    return { token, expiresAt };
  }

  private async recordSecurityEvent(userId: string | null, eventType: string, request: Request, detail: Record<string, unknown>) {
    await this.prisma.securityEvent.create({ data: {
      userId, eventType, ipDigest: digestIp(request.ip), userAgent: String(request.headers["user-agent"] ?? "").slice(0, 240) || null,
      detail: detail as Prisma.InputJsonObject,
    } }).catch(() => undefined); // Auditing must not turn a completed login into a broken response.
  }

  cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_DAYS() * 24 * 60 * 60 * 1000,
    };
  }

  clearCookieOptions() { return { ...this.cookieOptions(), maxAge: 0 }; }
  cookieName() { return SESSION_COOKIE(); }
}
