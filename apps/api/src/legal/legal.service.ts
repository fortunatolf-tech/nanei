import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import {
  DOCUMENTOS_LEGAIS,
  DOCUMENTOS_LEGAIS_LISTA,
  type DocumentoLegalId,
} from "@nanei/legal";
import { AuditService } from "../audit.service";
import { PrismaService } from "../prisma.service";

export interface PendenciaLegal {
  id: DocumentoLegalId;
  titulo: string;
  versaoVigente: string;
  /** Versão que o usuário aceitou antes, ou null se nunca aceitou. */
  versaoAceita: string | null;
}

const IDS_VALIDOS = new Set<string>(DOCUMENTOS_LEGAIS_LISTA.map((d) => d.id));

/**
 * Aceite e re-consentimento de documentos legais versionados (RF-ACC-08/09).
 * A versão vigente vem de @nanei/legal (fonte única); quando ela avança além
 * da versão aceita pelo usuário, o documento vira uma pendência.
 */
@Injectable()
export class LegalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Documentos cuja versão vigente é mais nova que a aceita pelo usuário. */
  async pendencias(userId: string): Promise<PendenciaLegal[]> {
    const versaoAceita = await this.versoesAceitas(userId);
    return DOCUMENTOS_LEGAIS_LISTA.filter(
      (doc) => versaoAceita.get(doc.id) !== doc.versao,
    ).map((doc) => ({
      id: doc.id,
      titulo: doc.titulo,
      versaoVigente: doc.versao,
      versaoAceita: versaoAceita.get(doc.id) ?? null,
    }));
  }

  /** Registra o aceite da versão vigente dos documentos informados. */
  async aceitar(
    userId: string,
    documentos: string[],
    req: Request,
  ): Promise<PendenciaLegal[]> {
    const ids = [...new Set(documentos)];
    if (ids.some((id) => !IDS_VALIDOS.has(id))) {
      throw new BadRequestException("documento legal desconhecido");
    }
    for (const id of ids as DocumentoLegalId[]) {
      const doc = DOCUMENTOS_LEGAIS[id];
      await this.prisma.consent.create({
        data: {
          userId,
          categoria: doc.id,
          finalidade: `aceite de ${doc.titulo} (v${doc.versao})`,
          versaoPolitica: doc.versao,
        },
      });
      await this.audit.log("reconsent", "Consent", {
        entidadeId: doc.id,
        userId,
        req,
      });
    }
    return this.pendencias(userId);
  }

  /** Última versão aceita por documento (categoria → versão). */
  private async versoesAceitas(
    userId: string,
  ): Promise<Map<string, string>> {
    const consents = await this.prisma.consent.findMany({
      where: {
        userId,
        categoria: { in: [...IDS_VALIDOS] },
        revogadoEm: null,
      },
      orderBy: { aceitoEm: "desc" },
    });
    const ultima = new Map<string, string>();
    for (const c of consents) {
      if (!ultima.has(c.categoria)) ultima.set(c.categoria, c.versaoPolitica);
    }
    return ultima;
  }
}
