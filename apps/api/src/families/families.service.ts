import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Papel } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import type { Request } from "express";
import { AuditService } from "../audit.service";
import { PrismaService } from "../prisma.service";
import type { CriarConviteDto } from "./families.dto";

const INVITE_TTL_MS = 48 * 3_600_000; // 48h (fluxo F4)

@Injectable()
export class FamiliesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Resumo da família: membros e (para admin) convites pendentes. */
  async resumo(userId: string, familyId: string) {
    const papel = await this.requireMember(userId, familyId);
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: { membros: { include: { user: { select: { email: true } } } } },
    });
    if (!family) throw new NotFoundException("família não encontrada");

    const membros = family.membros
      .map((m) => ({ email: m.user.email, papel: m.papel }))
      .sort((a, b) => a.email.localeCompare(b.email));

    // Convites pendentes só são visíveis a quem os gerencia (§7.3).
    const convites =
      papel === "admin"
        ? (
            await this.prisma.invite.findMany({
              where: {
                familyId,
                aceitoEm: null,
                revogadoEm: null,
                expiraEm: { gt: new Date() },
              },
              orderBy: { criadoEm: "desc" },
            })
          ).map((i) => ({
            id: i.id,
            email: i.email,
            papel: i.papel,
            expiraEm: i.expiraEm,
            criadoEm: i.criadoEm,
          }))
        : undefined;

    return { id: familyId, nome: family.nome, meuPapel: papel, membros, convites };
  }

  /** Cria um convite por link (token de uso único, 48h). Só admin (§7.3). */
  async criarConvite(
    userId: string,
    familyId: string,
    dto: CriarConviteDto,
    req: Request,
  ) {
    await this.requireAdmin(userId, familyId);
    const email = dto.email.toLowerCase();

    const jaMembro = await this.prisma.familyMember.findFirst({
      where: { familyId, user: { email } },
    });
    if (jaMembro) throw new BadRequestException("este e-mail já é membro da família");

    const token = randomBytes(32).toString("base64url");
    const invite = await this.prisma.invite.create({
      data: {
        familyId,
        email,
        papel: dto.papel,
        tokenHash: this.hash(token),
        criadoPorId: userId,
        expiraEm: new Date(Date.now() + INVITE_TTL_MS),
      },
    });
    await this.audit.log("invite_create", "Invite", {
      entidadeId: invite.id,
      userId,
      req,
    });
    // O token só é devolvido aqui — no banco fica apenas o hash.
    return {
      id: invite.id,
      email: invite.email,
      papel: invite.papel,
      expiraEm: invite.expiraEm,
      token,
    };
  }

  /** Revoga um convite pendente. Só admin. */
  async revogarConvite(
    userId: string,
    familyId: string,
    id: string,
    req: Request,
  ) {
    await this.requireAdmin(userId, familyId);
    const invite = await this.prisma.invite.findFirst({
      where: { id, familyId },
    });
    if (!invite) throw new NotFoundException("convite não encontrado");
    if (!invite.aceitoEm && !invite.revogadoEm) {
      await this.prisma.invite.update({
        where: { id },
        data: { revogadoEm: new Date() },
      });
    }
    await this.audit.log("invite_revoke", "Invite", {
      entidadeId: id,
      userId,
      req,
    });
    return { ok: true };
  }

  /** Preview público do convite (para a tela de aceite). */
  async info(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { tokenHash: this.hash(token) },
      include: { family: { select: { nome: true } } },
    });
    if (!invite) return { valido: false as const };
    const valido =
      !invite.aceitoEm && !invite.revogadoEm && invite.expiraEm > new Date();
    return {
      valido,
      familyNome: invite.family.nome,
      papel: invite.papel,
      email: invite.email,
    };
  }

  /** Aceita o convite: entra na família com o papel definido (F4). */
  async aceitar(userId: string, token: string, req: Request) {
    const invite = await this.prisma.invite.findUnique({
      where: { tokenHash: this.hash(token) },
    });
    if (
      !invite ||
      invite.revogadoEm ||
      invite.aceitoEm ||
      invite.expiraEm <= new Date()
    ) {
      throw new BadRequestException("convite inválido ou expirado");
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new ForbiddenException("este convite foi enviado para outro e-mail");
    }
    const existente = await this.prisma.familyMember.findUnique({
      where: { userId_familyId: { userId, familyId: invite.familyId } },
    });
    await this.prisma.$transaction(async (tx) => {
      if (!existente) {
        await tx.familyMember.create({
          data: { userId, familyId: invite.familyId, papel: invite.papel },
        });
      }
      await tx.invite.update({
        where: { id: invite.id },
        data: { aceitoEm: new Date(), aceitoPorId: userId },
      });
    });
    await this.audit.log("invite_accept", "Invite", {
      entidadeId: invite.id,
      userId,
      req,
    });
    return { familyId: invite.familyId, papel: invite.papel };
  }

  private async requireMember(userId: string, familyId: string): Promise<Papel> {
    const membro = await this.prisma.familyMember.findUnique({
      where: { userId_familyId: { userId, familyId } },
    });
    if (!membro) throw new ForbiddenException("sem acesso a esta família");
    return membro.papel;
  }

  private async requireAdmin(userId: string, familyId: string): Promise<void> {
    const papel = await this.requireMember(userId, familyId);
    if (papel !== "admin") {
      throw new ForbiddenException("apenas o administrador gerencia cuidadores");
    }
  }

  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
