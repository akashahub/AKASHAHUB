import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CallMode = "fechamento" | "entrada";
export type Energy = "baixa" | "media" | "alta";

interface CallState {
  mode: CallMode;
  actIndex: number;
  cadernoDone: Record<string, boolean>;
  pit: number;
  namedValue: number | null;
  notes: string;
  answers: Record<string, string>;
  startedAt: number | null;
  elapsed: number;
  energy: Energy;
  closed: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setMode: (mode: CallMode) => void;
  setAct: (index: number) => void;
  toggleCaderno: (id: string) => void;
  setPit: (n: number) => void;
  setNamedValue: (n: number | null) => void;
  setNotes: (v: string) => void;
  setAnswer: (id: string, v: string) => void;
  startTimer: () => void;
  tick: () => void;
  resetTimer: () => void;
  setEnergy: (e: Energy) => void;
  setClosed: (v: boolean) => void;
  resetCall: () => void;
}

const initial = {
  mode: "fechamento" as CallMode,
  actIndex: 0,
  cadernoDone: {} as Record<string, boolean>,
  pit: 0,
  namedValue: null as number | null,
  notes: "",
  answers: {} as Record<string, string>,
  startedAt: null as number | null,
  elapsed: 0,
  energy: "media" as Energy,
  closed: false,
  hydrated: false,
};

export const useCallStore = create<CallState>()(
  persist(
    (set, get) => ({
      ...initial,
      setHydrated: (hydrated) => set({ hydrated }),
      setMode: (mode) => set({ mode, actIndex: 0 }),
      setAct: (actIndex) => set({ actIndex }),
      toggleCaderno: (id) =>
        set({
          cadernoDone: {
            ...get().cadernoDone,
            [id]: !get().cadernoDone[id],
          },
        }),
      setPit: (pit) => set({ pit }),
      setNamedValue: (namedValue) => set({ namedValue }),
      setNotes: (notes) => set({ notes }),
      setAnswer: (id, v) => set({ answers: { ...get().answers, [id]: v } }),
      startTimer: () =>
        set({
          startedAt: Date.now() - get().elapsed * 1000,
        }),
      tick: () => {
        const { startedAt } = get();
        if (!startedAt) return;
        set({ elapsed: Math.floor((Date.now() - startedAt) / 1000) });
      },
      resetTimer: () => set({ startedAt: null, elapsed: 0 }),
      setEnergy: (energy) => set({ energy }),
      setClosed: (closed) => set({ closed }),
      resetCall: () => set({ ...initial, hydrated: true }),
    }),
    {
      name: "mesa-francesca",
      skipHydration: true,
      partialize: (s) => ({
        mode: s.mode,
        actIndex: s.actIndex,
        cadernoDone: s.cadernoDone,
        pit: s.pit,
        namedValue: s.namedValue,
        notes: s.notes,
        answers: s.answers,
        energy: s.energy,
        closed: s.closed,
        elapsed: s.elapsed,
      }),
    },
  ),
);
