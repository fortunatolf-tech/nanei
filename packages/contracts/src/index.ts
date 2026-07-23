/**
 * @nanei/contracts — entidades e contratos compartilhados entre módulos.
 * Fonte: docs/04-arquitetura-tecnica.md §4.3 (modelo de dados).
 * Mudança em contrato exige aprovação da equipe Core (§8.1).
 */

export type Papel = "admin" | "editor" | "registrador" | "visualizador";

export type TipoEvento =
  | "mamada"
  | "mamadeira"
  | "solido"
  | "bombeamento"
  | "fralda"
  | "sono"
  | "banho"
  | "medicamento"
  | "vacina"
  | "temperatura"
  | "crescimento"
  | "humor"
  | "atividade"
  | "nota";

export interface User {
  id: string;
  email: string;
  criadoEm: string;
}

export interface Family {
  id: string;
  nome: string;
}

export interface FamilyMember {
  userId: string;
  familyId: string;
  papel: Papel;
}

export interface Baby {
  id: string;
  familyId: string;
  nome: string;
  nascimento: string;
  /** Data prevista do parto — base do cálculo de saltos (RF-DEV-01) */
  dataPrevistaParto: string;
  sexo?: "F" | "M";
  fotoUrl?: string;
}

export interface Consent {
  id: string;
  userId: string;
  categoria: string;
  finalidade: string;
  versaoPolitica: string;
  aceitoEm: string;
  revogadoEm?: string;
}

/**
 * Evento de rastreamento (TRK). `payload` carrega campos específicos por
 * tipo sem exigir migração (ex.: mamada → { lado, duracaoE, duracaoD }).
 */
export interface Event<TPayload = Record<string, unknown>> {
  id: string;
  babyId: string;
  tipo: TipoEvento;
  inicio: string;
  fim?: string;
  payload: TPayload;
  local?: string;
  criadoPor: string;
  criadoEm: string;
  editadoEm?: string;
}

export interface Milestone {
  id: string;
  babyId: string;
  categoria: string;
  descricao: string;
  atingidoEm?: string;
  fotoUrl?: string;
  nota?: string;
}

export interface Leap {
  id: string;
  babyId: string;
  numero: number;
  inicioPrevisto: string;
  fimPrevisto: string;
}

export interface Reminder {
  id: string;
  userId: string;
  babyId: string;
  tipo: string;
  regra: "intervalo" | "horario";
  config: Record<string, unknown>;
  ativo: boolean;
}

export interface Drug {
  id: string;
  nomeGenerico: string;
  nomesComerciais: string[];
  classe: string;
  fontes: string[];
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  ip: string;
  userAgent: string;
  timestamp: string;
}

/** Planos do modelo freemium (Parte 12) */
export type Plano = "gratuito" | "premium";

/** Origem dos tokens de IA — dupla origem (RF-BIL-03) */
export type OrigemTokensIA = "plataforma" | "byok";

export interface Subscription {
  id: string;
  userId: string;
  plano: Plano;
  ciclo: "mensal" | "anual";
  status: "ativa" | "cancelada" | "inadimplente";
  gatewayRef?: string;
  inicio: string;
  fim?: string;
}

export interface TokenUsage {
  id: string;
  userId: string;
  /** Período no formato AAAA-MM */
  periodo: string;
  tokensConsumidos: number;
  quotaPlano: number;
}
