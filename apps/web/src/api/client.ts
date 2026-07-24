/**
 * Cliente HTTP da API do Nanei. Guarda os tokens no localStorage, injeta o
 * access token e renova automaticamente com o refresh token quando expira
 * (RF-ACC-02). Mesma origem do PWA — caminho relativo /v1.
 */
const BASE = "/v1";
const ACCESS_KEY = "nanei.access";
const REFRESH_KEY = "nanei.refresh";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(REFRESH_KEY) !== null;
}

export function saveTokens(t: Tokens) {
  localStorage.setItem(ACCESS_KEY, t.accessToken);
  localStorage.setItem(REFRESH_KEY, t.refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return false;
  // Evita corrida: uma única renovação em voo por vez.
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return false;
      }
      saveTokens((await res.json()) as Tokens);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

interface RequestOpts {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  retry?: boolean;
}

export async function api<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true, retry = true } = opts;
  const h: Record<string, string> = { ...headers };
  if (body !== undefined) h["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    if (await tryRefresh()) {
      return api<T>(path, { ...opts, retry: false });
    }
    clearTokens();
  }

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = (await res.json()) as { message?: string | string[] };
      msg = Array.isArray(data.message)
        ? data.message.join(", ")
        : (data.message ?? msg);
    } catch {
      /* corpo não-JSON */
    }
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
