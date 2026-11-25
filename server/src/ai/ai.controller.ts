import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "../auth/session-auth.guard";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { AiService } from "./ai.service";
import { EyeRequestDto } from "./eye.dto";

@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Get("status") status() { return this.ai.status(); }

  @Post("eye")
  @UseGuards(SessionAuthGuard)
  async observe(@Req() req: AuthenticatedRequest, @Body() body: EyeRequestDto) {
    return this.ai.observe(req.authUser.id, body);
  }
}
