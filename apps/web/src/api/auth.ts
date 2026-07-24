import { api, saveTokens, clearTokens, type Tokens } from "./client";

export interface RegisterInput {
  email: string;
  senha: string;
  consentimentos: string[];
  aceiteTermos: boolean;
  aceitePolitica: boolean;
  nomeBebe?: string;
  nascimentoBebe?: string;
}

export async function register(input: RegisterInput): Promise<void> {
  const tokens = await api<Tokens>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
  saveTokens(tokens);
}

export async function login(email: string, senha: string): Promise<void> {
  const tokens = await api<Tokens>("/auth/login", {
    method: "POST",
    body: { email, senha },
    auth: false,
  });
  saveTokens(tokens);
}

export function logout() {
  clearTokens();
}
