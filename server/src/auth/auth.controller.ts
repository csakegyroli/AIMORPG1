import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { SessionAuthGuard, type AuthenticatedRequest } from "./session-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  @Throttle({ default: { limit: 4, ttl: 15 * 60 * 1000 } })
  async register(@Body() body: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(body, req);
    res.cookie(this.auth.cookieName(), result.token, this.auth.cookieOptions());
    return { user: result.user, expiresAt: result.expiresAt.toISOString() };
  }

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 15 * 60 * 1000 } })
  async login(@Body() body: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(body, req);
    res.cookie(this.auth.cookieName(), result.token, this.auth.cookieOptions());
    return { user: result.user, expiresAt: result.expiresAt.toISOString() };
  }

  @Post("logout")
  async logout(@Req() req: Request & { cookies?: Record<string, unknown> }, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[this.auth.cookieName()];
    await this.auth.logout(typeof token === "string" ? token : undefined, req);
    res.clearCookie(this.auth.cookieName(), this.auth.clearCookieOptions());
    return { ok: true };
  }

  @Get("me")
  @UseGuards(SessionAuthGuard)
  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.auth.validateSession(req.sessionToken);
    if (!user) return { user: null };
    const summary = await this.auth.activeSecuritySummary(user.id);
    return { user: { ...user, security: summary } };
  }
}
