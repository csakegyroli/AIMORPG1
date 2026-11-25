import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { SessionAuthGuard } from "./auth/session-auth.guard";
import { OriginGuard } from "./auth/origin.guard";
import { GameController } from "./game/game.controller";
import { AiController } from "./ai/ai.controller";
import { AiService } from "./ai/ai.service";
import { SystemController } from "./system/system.controller";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])],
  controllers: [AuthController, GameController, AiController, SystemController],
  providers: [
    PrismaService, AuthService, SessionAuthGuard, AiService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: OriginGuard },
  ],
})
export class AppModule {}
