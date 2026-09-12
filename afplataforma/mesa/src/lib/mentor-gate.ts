import { create } from "zustand";
import { persist } from "zustand/middleware";

const SESSION_KEY = "mesa-mentor-open";
const PEPPER = "akasha-mesa-mentor::";

export async function hashPin(pin: string) {
  const data = new TextEncoder().encode(`${PEPPER}${pin.trim()}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface MentorGateState {
  pinHash: string | null;
  unlocked: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  hydrateSession: () => void;
  setPin: (hash: string) => void;
  unlock: () => void;
  lock: () => void;
  clearPin: () => void;
}

export const useMentorGate = create<MentorGateState>()(
  persist(
    (set) => ({
      pinHash: null,
      unlocked: false,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      hydrateSession: () => {
        const open =
          typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
        set({ unlocked: open });
      },
      setPin: (pinHash) => set({ pinHash }),
      unlock: () => {
        if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
        set({ unlocked: true });
      },
      lock: () => {
        if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
        set({ unlocked: false });
      },
      clearPin: () => {
        if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
        set({ pinHash: null, unlocked: false });
      },
    }),
    {
      name: "mesa-mentor-gate",
      skipHydration: true,
      partialize: (s) => ({ pinHash: s.pinHash }),
    },
  ),
);
