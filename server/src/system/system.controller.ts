import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Controller("system")
export class SystemController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("health")
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { ok: true, database: "connected", aiConfigured: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_MODEL || "gpt-6-luna" };
    } catch {
      return { ok: false, database: "disconnected", aiConfigured: Boolean(process.env.OPENAI_API_KEY), message: "A PostgreSQL-adatbázis nem érhető el." };
    }
  }
}
