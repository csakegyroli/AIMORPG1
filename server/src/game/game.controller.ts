import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Post, Body, Req, UseGuards } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from "../auth/session-auth.guard";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { PrismaService } from "../prisma.service";
import { CreateSaveDto } from "./game.dto";

const MAX_SAVES = 10;
const MAX_SAVE_BYTES = 900_000;

@Controller("game/saves")
@UseGuards(SessionAuthGuard)
export class GameController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const saves = await this.prisma.gameSave.findMany({ where: { ownerId: req.authUser.id }, orderBy: { updatedAt: "desc" }, select: { id: true, label: true, schemaVersion: true, createdAt: true, updatedAt: true } });
    return { saves };
  }

  @Get(":id")
  async getOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const save = await this.prisma.gameSave.findFirst({ where: { id, ownerId: req.authUser.id } });
    if (!save) throw new NotFoundException("A mentés nem található.");
    return { save };
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() body: CreateSaveDto) {
    const payloadText = JSON.stringify(body.payload);
    if (Buffer.byteLength(payloadText, "utf8") > MAX_SAVE_BYTES) throw new BadRequestException("A mentés túl nagy (max. 900 KB).");
    if (body.payload.initialized !== true || typeof body.payload.name !== "string" || !body.payload.equipment || !body.payload.inventory || !body.payload.baseStats) {
      throw new BadRequestException("A mentés alapstruktúrája érvénytelen.");
    }
    const count = await this.prisma.gameSave.count({ where: { ownerId: req.authUser.id } });
    if (count >= MAX_SAVES) throw new BadRequestException(`Egy fiók legfeljebb ${MAX_SAVES} mentést tárolhat. Törölj egy régebbit.`);
    const safeLabel = body.label.normalize("NFC").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 70) || "Névtelen kaland";
    const save = await this.prisma.gameSave.create({ data: { ownerId: req.authUser.id, label: safeLabel, schemaVersion: body.schemaVersion, payload: body.payload as unknown as Prisma.InputJsonObject } });
    return { save: { id: save.id, label: save.label, schemaVersion: save.schemaVersion, createdAt: save.createdAt, updatedAt: save.updatedAt } };
  }

  @Delete(":id")
  async remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const result = await this.prisma.gameSave.deleteMany({ where: { id, ownerId: req.authUser.id } });
    if (!result.count) throw new NotFoundException("A mentés nem található.");
    return { ok: true };
  }
}
