import type { Papel } from "@nanei/contracts";
import { api } from "./client";

export interface Membro {
  email: string;
  papel: Papel;
}

export interface ConvitePendente {
  id: string;
  email: string;
  papel: Papel;
  expiraEm: string;
  criadoEm: string;
}

export interface ResumoFamilia {
  id: string;
  nome: string;
  meuPapel: Papel;
  membros: Membro[];
  /** Presente apenas quando o usuário é admin (§7.3). */
  convites?: ConvitePendente[];
}

export function getResumoFamilia(familyId: string): Promise<ResumoFamilia> {
  return api<ResumoFamilia>(`/families/${familyId}`);
}

export interface ConviteCriado {
  id: string;
  email: string;
  papel: Papel;
  expiraEm: string;
  /** Token em claro — só existe nesta resposta; compõe o link do convite. */
  token: string;
}

export function criarConvite(
  familyId: string,
  email: string,
  papel: Papel,
): Promise<ConviteCriado> {
  return api<ConviteCriado>(`/families/${familyId}/invites`, {
    method: "POST",
    body: { email, papel },
  });
}

export function revogarConvite(
  familyId: string,
  id: string,
): Promise<{ ok: boolean }> {
  return api(`/families/${familyId}/invites/${id}`, { method: "DELETE" });
}

export interface ConviteInfo {
  valido: boolean;
  familyNome?: string;
  papel?: Papel;
  email?: string;
}

export function getConviteInfo(token: string): Promise<ConviteInfo> {
  return api<ConviteInfo>(`/invites/${encodeURIComponent(token)}`, {
    auth: false,
  });
}

export function aceitarConvite(
  token: string,
): Promise<{ familyId: string; papel: Papel }> {
  return api(`/invites/${encodeURIComponent(token)}/accept`, {
    method: "POST",
  });
}

/** Monta o link de convite a partir do token (mesma origem do PWA). */
export function linkDoConvite(token: string): string {
  return `${window.location.origin}/?convite=${encodeURIComponent(token)}`;
}

const ROTULO_PAPEL: Record<Papel, string> = {
  admin: "Administrador",
  editor: "Editor",
  registrador: "Registrador",
  visualizador: "Visualizador",
};

export function rotuloPapel(papel: Papel): string {
  return ROTULO_PAPEL[papel];
}
