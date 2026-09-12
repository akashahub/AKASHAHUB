export type Faixa = {
  id: string;
  range: string;
  min: number;
  max: number;
  name: string;
  opens: string[];
  closed: string[];
  done: string;
  color: "muted" | "warn" | "ok" | "accent";
};

export const FAIXAS: Faixa[] = [
  {
    id: "sessao",
    range: "R$ 350",
    min: 0,
    max: 1999,
    name: "Call de Entrada",
    opens: [
      "Sessão de Alinhamento 1h30",
      "Dossiê de ação",
      "Mapa mínimo",
      "Avaliação de continuidade",
    ],
    closed: [
      "Mapa-mãe completo",
      "Plataforma Convergência",
      "Abertura profunda do Akasha",
      "Mentoria dentro da casa dela",
    ],
    done: "Sessão feita + dossiê entregue.",
    color: "muted",
  },
  {
    id: "minimo",
    range: "R$ 2–5 mil",
    min: 2000,
    max: 4999,
    name: "Arquitetura limitada",
    opens: [
      "Alinhamento estendido",
      "Mapa do mapa dela",
      "Algumas sessões",
      "Orientação, pouca execução",
    ],
    closed: [
      "DNA completo do Akasha",
      "V1 da Convergência",
      "Geração de conteúdo em escala",
    ],
    done: "Mapa visual + 2 sessões + recorte escrito.",
    color: "warn",
  },
  {
    id: "entrada",
    range: "R$ 5–7 mil",
    min: 5000,
    max: 6999,
    name: "Entrada estratégica",
    opens: [
      "Acesso relevante ao Akasha",
      "Mapa-mãe proporcional",
      "AF Plataforma",
      "Estrutura e criação inicial",
      "Colaboração real",
      "Roteiro da Ascensão aplicado a ela",
    ],
    closed: [
      "Plataforma Convergência até o fim",
      "Palestras no ecossistema dela no ano que vem",
    ],
    done: "Acesso + kickoff + primeiro entregável em 72h.",
    color: "ok",
  },
  {
    id: "v1",
    range: "R$ 7–17 mil",
    min: 7000,
    max: 17000,
    name: "Obra V1 Convergência",
    opens: [
      "Abertura profunda da arquitetura",
      "Construção da V1 acordada da plataforma",
      "Integração, prototipagem, estrutura",
      "Participação operacional inicial",
      "AF + Ascensão como benefício",
      "Mapa-mãe completo",
    ],
    closed: [
      "Feature infinita até o ano que vem",
      "Audiovisual, hotel, equipe, cloud",
      "Palestras em inglês no evento dela (custo extra)",
      "Sociedade jurídica automática",
    ],
    done: "V1 com Definition of Done assinada. Empreiteiro: a casa custa X, não o calendário.",
    color: "accent",
  },
];

export function formatHint() {
  return "Aguarde o número dela. Se perguntar o preço, recorte o nível — não o piso.";
}

export function faixaFor(value: number | null): Faixa | null {
  if (value == null || Number.isNaN(value)) return null;
  if (value < 2000) return FAIXAS[0] ?? null;
  if (value < 5000) return FAIXAS[1] ?? null;
  if (value < 7000) return FAIXAS[2] ?? null;
  return FAIXAS[3] ?? null;
}

export const ABOVE_17 = {
  title: "Acima de R$ 17 mil",
  body: "Não aceitar como ‘me compra para sempre’. Recortar uma segunda obra ou um segundo acordo (produção, audiovisual, evento físico). O teto desta ativação existe para você transbordar com qualidade.",
};

export const SMART_MONEY_LANG = {
  internal: "smart money / founding activation",
  external: [
    "Contribuição de ativação",
    "Founding activation",
    "Strategic build-in",
  ],
  why: "‘Smart money’ soa investimento com equity. Revenue share, percentual e sociedade são um segundo acordo, quando a economia existir.",
};
