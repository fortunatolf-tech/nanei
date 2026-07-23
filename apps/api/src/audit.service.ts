import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { PrismaService } from "./prisma.service";

/**
 * Registro auditável de operações com dados pessoais (RF-ACC-07, LGPD
 * art. 37). Append-only: este serviço só insere; não há update/delete.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    acao: string,
    entidade: string,
    opts: { entidadeId?: string; userId?: string; req?: Request } = {},
  ) {
    await this.prisma.auditLog.create({
      data: {
        acao,
        entidade,
        entidadeId: opts.entidadeId,
        userId: opts.userId,
        ip: opts.req?.ip,
        userAgent: opts.req?.headers["user-agent"]?.slice(0, 255),
      },
    });
  }
}
