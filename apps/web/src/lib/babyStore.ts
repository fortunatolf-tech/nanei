import type { Baby } from "@nanei/contracts";
import { createBaby, listBabies, type NewBabyInput } from "../api/babies";
import { setActiveBaby, sync } from "./eventStore";

/**
 * Store dos bebês da conta (RF-FAM-01): lista, bebê ativo (persistido) e
 * troca em 1 toque. Coordena o eventStore para focar os dados do bebê ativo.
 */
const ACTIVE_KEY = "nanei.activeBaby";

interface State {
  babies: Baby[];
  activeId: string | null;
  carregado: boolean;
}

let state: State = {
  babies: [],
  activeId: localStorage.getItem(ACTIVE_KEY),
  carregado: false,
};

const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  for (const l of listeners) l();
}

export function subscribeBabies(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getBabyState(): State {
  return state;
}

function aplicarAtivo(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
  setActiveBaby(id);
}

/** Carrega os bebês do servidor e fixa o ativo (o salvo, ou o primeiro). */
export async function loadBabies(): Promise<void> {
  try {
    const babies = await listBabies();
    const salvo = state.activeId;
    const ativo = babies.some((b) => b.id === salvo)
      ? salvo
      : (babies[0]?.id ?? null);
    set({ babies, activeId: ativo, carregado: true });
    aplicarAtivo(ativo);
  } catch {
    // Offline: mantém o ativo salvo para o eventStore servir do cache local.
    set({ carregado: true });
    aplicarAtivo(state.activeId);
  }
}

/** Alterna o bebê em foco (RF-FAM-01) — 1 toque. */
export function selectBaby(id: string) {
  if (id === state.activeId) return;
  set({ activeId: id });
  aplicarAtivo(id);
}

/** Cadastra um bebê e passa a focá-lo. */
export async function addBaby(input: NewBabyInput): Promise<void> {
  const baby = await createBaby(input);
  set({ babies: [...state.babies, baby], activeId: baby.id });
  aplicarAtivo(baby.id);
  void sync();
}

/** Limpa o estado ao sair da conta. */
export function resetBabies() {
  set({ babies: [], activeId: null, carregado: false });
  localStorage.removeItem(ACTIVE_KEY);
  setActiveBaby(null);
}
