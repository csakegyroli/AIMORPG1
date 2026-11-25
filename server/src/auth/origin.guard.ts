import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class OriginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
    const origin = request.headers.origin;
    const expected = process.env.WEB_ORIGIN || "http://localhost:3000";
    if (typeof origin === "string" && origin !== expected) throw new ForbiddenException("Nem engedélyezett kérésforrás.");
    if (process.env.NODE_ENV === "production" && typeof origin !== "string") throw new ForbiddenException("Hiányzó kérésforrás.");
    return true;
  }
}
