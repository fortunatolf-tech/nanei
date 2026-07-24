import type { DocumentoLegalId } from "@nanei/legal";
import { api } from "./client";

export interface PendenciaLegal {
  id: DocumentoLegalId;
  titulo: string;
  versaoVigente: string;
  versaoAceita: string | null;
}

/** Documentos legais pendentes de re-aceite para o usuário logado (RF-ACC-08). */
export async function getPendenciasLegais(): Promise<PendenciaLegal[]> {
  const { pendencias } = await api<{ pendencias: PendenciaLegal[] }>(
    "/legal/status",
  );
  return pendencias;
}

/** Registra o aceite da versão vigente dos documentos informados. */
export async function aceitarLegal(
  documentos: DocumentoLegalId[],
): Promise<PendenciaLegal[]> {
  const { pendencias } = await api<{ pendencias: PendenciaLegal[] }>(
    "/legal/aceite",
    { method: "POST", body: { documentos } },
  );
  return pendencias;
}
