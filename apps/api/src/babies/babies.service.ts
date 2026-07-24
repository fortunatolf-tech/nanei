import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Papel } from "@prisma/client";
import { AuditService } from "../audit.service";
import { PrismaService } from "../prisma.service";
import type {
  CreateBabyDto,
  CreateEventDto,
  UpdateEventDto,
} from "./babies.dto";

/** Papéis com permissão de criar registros (matriz §7.3). */
const PODE_REGISTRAR: Papel[] = ["admin", "editor", "registrador"];

@Injectable()
export class BabiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Autorização papel × família em toda rota de baby (§4.4). */
  private async membership(userId: string, babyId: string) {
    const baby = await this.prisma.baby.findUnique({ where: { id: babyId } });
    if (!baby) throw new NotFoundException("bebê não encontrado");
    const membro = await this.prisma.familyMember.findUnique({
      where: { userId_familyId: { userId, familyId: baby.familyId } },
    });
    if (!membro) throw new ForbiddenException("sem acesso a este bebê");
    return { baby, papel: membro.papel };
  }

  async list(userId: string) {
    return this.prisma.baby.findMany({
      where: { family: { membros: { some: { userId } } } },
      orderBy: { nascimento: "desc" },
    });
  }

  async create(userId: string, dto: CreateBabyDto) {
    const membro = await this.prisma.familyMember.findFirst({
      where: { userId, papel: "admin" },
    });
    if (!membro) throw new ForbiddenException("apenas admin cria bebês");
    const baby = await this.prisma.baby.create({
      data: {
        familyId: membro.familyId,
        nome: dto.nome,
        nascimento: new Date(dto.nascimento),
        dataPrevistaParto: dto.dataPrevistaParto
          ? new Date(dto.dataPrevistaParto)
          : undefined,
        sexo: dto.sexo,
      },
    });
    await this.audit.log("baby_create", "Baby", {
      entidadeId: baby.id,
      userId,
    });
    return baby;
  }

  async listEvents(userId: string, babyId: string, de?: string, ate?: string) {
    await this.membership(userId, babyId);
    return this.prisma.event.findMany({
      where: {
        babyId,
        inicio: {
          gte: de ? new Date(de) : undefined,
          lt: ate ? new Date(ate) : undefined,
        },
      },
      orderBy: { inicio: "desc" },
      take: 500,
    });
  }

  /** Criação idempotente p/ fila offline (§4.4 — idempotency-key). */
  async createEvent(
    userId: string,
    babyId: string,
    dto: CreateEventDto,
    idempotencyKey?: string,
  ) {
    const { papel } = await this.membership(userId, babyId);
    if (!PODE_REGISTRAR.includes(papel)) {
      throw new ForbiddenException("papel sem permissão de registrar");
    }
    if (idempotencyKey) {
      const existente = await this.prisma.event.findUnique({
        where: { idempotencyKey },
      });
      if (existente) return existente;
    }
    const event = await this.prisma.event.create({
      data: {
        babyId,
        tipo: dto.tipo,
        inicio: new Date(dto.inicio),
        fim: dto.fim ? new Date(dto.fim) : undefined,
        payload: dto.payload as object,
        local: dto.local,
        criadoPorId: userId,
        idempotencyKey,
      },
    });
    await this.audit.log("event_create", "Event", {
      entidadeId: event.id,
      userId,
    });
    return event;
  }

  /** Edição retroativa de data/hora ou payload (RF-TRK-14). */
  async updateEvent(
    userId: string,
    babyId: string,
    eventId: string,
    dto: UpdateEventDto,
  ) {
    const { papel } = await this.membership(userId, babyId);
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, babyId },
    });
    if (!event) throw new NotFoundException("registro não encontrado");
    const proprio = event.criadoPorId === userId;
    // Registrador edita só os próprios; admin/editor editam de terceiros (§7.3)
    if (!proprio && !["admin", "editor"].includes(papel)) {
      throw new ForbiddenException("papel sem permissão de editar de terceiros");
    }
    if (proprio && !PODE_REGISTRAR.includes(papel)) {
      throw new ForbiddenException("papel sem permissão");
    }
    const atualizado = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        inicio: dto.inicio ? new Date(dto.inicio) : undefined,
        fim: dto.fim ? new Date(dto.fim) : undefined,
        payload: dto.payload ? (dto.payload as object) : undefined,
        editadoEm: new Date(),
      },
    });
    await this.audit.log("event_update", "Event", {
      entidadeId: eventId,
      userId,
    });
    return atualizado;
  }

  async deleteEvent(userId: string, babyId: string, eventId: string) {
    const { papel } = await this.membership(userId, babyId);
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, babyId },
    });
    if (!event) throw new NotFoundException("registro não encontrado");
    // Registrador só exclui os próprios registros; admin/editor excluem de terceiros (§7.3)
    const proprio = event.criadoPorId === userId;
    if (!proprio && !["admin", "editor"].includes(papel)) {
      throw new ForbiddenException("papel sem permissão de excluir de terceiros");
    }
    if (proprio && !PODE_REGISTRAR.includes(papel)) {
      throw new ForbiddenException("papel sem permissão");
    }
    await this.prisma.event.delete({ where: { id: eventId } });
    await this.audit.log("event_delete", "Event", {
      entidadeId: eventId,
      userId,
    });
    return { ok: true };
  }
}
