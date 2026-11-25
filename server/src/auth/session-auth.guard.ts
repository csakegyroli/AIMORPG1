import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import type { AuthenticatedRequestUser } from "./auth.types";

export type AuthenticatedRequest = Request & { authUser: AuthenticatedRequestUser; sessionToken: string };

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookieName = process.env.COOKIE_NAME || "aimorpg_session";
    const token = (req as Request & { cookies?: Record<string, unknown> }).cookies?.[cookieName];
    if (typeof token !== "string" || token.length < 32 || token.length > 128) throw new UnauthorizedException("Jelentkezz be a folytatáshoz.");
    const user = await this.auth.validateSession(token);
    if (!user) throw new UnauthorizedException("A munkamenet lejárt. Jelentkezz be újra.");
    req.authUser = user;
    req.sessionToken = token;
    return true;
  }
}
