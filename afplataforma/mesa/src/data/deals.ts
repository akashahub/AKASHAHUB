export type DealStatus = "ativa" | "breve";

export type DealPack = {
  id: string;
  name: string;
  person: string;
  range: string;
  status: DealStatus;
  blurb: string;
  path: "/afplataforma/mentor";
  tags: string[];
};

/** Motor da mesa é um. Cada deal é um dossiê. Só Francesca está viva. */
export const DEALS: DealPack[] = [
  {
    id: "francesca",
    name: "Francesca",
    person: "Francesca Giobbi",
    range: "R$ 2–17 mil",
    status: "ativa",
    blurb: "Convergência · AF · smart money. Peer, não mentoranda.",
    path: "/afplataforma/mentor",
    tags: ["Fechamento", "Convergência", "Colabocracy"],
  },
];

export const FUTURE_SLOT = {
  title: "Próximo fechamento",
  body: "Quando houver outro deal de 2 a 17 mil, entra aqui. Mesmo motor, outro dossiê. A AF do aluno não muda.",
};

export const PORTA = {
  rule: "Aba Mentor. Código. Só você.",
  where: "AF Plataforma → Mentor",
  opens: "A mesa completa, dentro da plataforma.",
  never: [
    "Não mistura com módulos, dashboard, call de acompanhamento ou notas do aluno",
    "Não compartilha dados da call com o banco da mentoria",
    "Próximo contato entra como outro fechamento — a AF do aluno não muda",
  ],
};
