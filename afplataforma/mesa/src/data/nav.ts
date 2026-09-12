import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ListChecks,
  Shield,
  Landmark,
  Orbit,
  Scale,
  MessageSquareWarning,
  Sunrise,
  Network,
  LockKeyhole,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
};

export const NAV: NavItem[] = [
  { to: "/afplataforma/mentor", label: "Mesa", short: "Mesa", icon: LayoutDashboard },
  { to: "/caderno", label: "Caderno", short: "Caderno", icon: ListChecks },
  { to: "/fechamento", label: "Fechamento", short: "PIT", icon: Shield },
  { to: "/af", label: "AF Plataforma", short: "AF", icon: Landmark },
  { to: "/convergencia", label: "Convergência", short: "Conv.", icon: Orbit },
  { to: "/faixas", label: "Faixas", short: "Faixas", icon: Scale },
  { to: "/objecoes", label: "Objeções", short: "Obj.", icon: MessageSquareWarning },
  { to: "/ascensao", label: "Ascensão", short: "Asc.", icon: Sunrise },
  { to: "/mapa", label: "Mapa Mãe", short: "Mapa", icon: Network },
  { to: "/acesso", label: "Antes / Depois", short: "Acesso", icon: LockKeyhole },
];
