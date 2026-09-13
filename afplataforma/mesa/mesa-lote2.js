/* Lote 2 — entrega, garantia, o que mandar no "fechei". Core + playbook Francesca. */
const MARCOS_17K = [
  { n: "01", name: "Arquitetura", v: 2000, what: "Mapa dos dois DNAs. O que converge. O que permanece de cada um.", done: "Uma página escrita. Os dois reconhecem." },
  { n: "02", name: "Protótipo", v: 3000, what: "Convergência visível em menos de 30 dias.", done: "Ela percorre o fluxo na tela. Login → live → assistir." },
  { n: "03", name: "Plataforma V1", v: 5000, what: "Login, perfil, criar live, descobrir, assistir, chat, convidar, encerrar.", done: "Duas pessoas usam de verdade. Checklist de aceite." },
  { n: "04", name: "Streaming · replay · admin", v: 2500, what: "Motor da live, assistir depois, biblioteca, área de controle.", done: "Uma live gravada e reassistida. Admin abre." },
  { n: "05", name: "Mentoria no campo dela", v: 2000, what: "Condução 12 meses. Ritmo combinado. Não é aluna comum. Não é tempo infinito.", done: "Calendário dos 12 meses combinado." },
  { n: "06", name: "Conteúdo", v: 1000, what: "Estrutura editorial. Teto: 15 curtos, 8 imagens, 3 profundos, 4 internos por mês. Não é fábrica solta.", done: "Calendário do primeiro mês." },
  { n: "07", name: "Palestra 1", v: 800, what: "Preparação PT → EN, slides, treino. Um evento se estiver definido. Passagem e hotel: fora.", done: "Ensaio gravado. Data do evento ou “ainda sem data”." },
  { n: "08", name: "Teste e chaves", v: 700, what: "Testar, achar o que quebra, documentos, entregar acessos.", done: "Checklist de aceite assinado." }
];

const INCLUIDO = {
  in: [
    "Os 8 marcos acima",
    "12 meses de construção conjunta, com ritmo combinado",
    "Acesso proporcional à AF Plataforma depois do pagamento",
    "Primeira sessão de alinhamento no campo dela"
  ],
  out: [
    "Tempo ilimitado",
    "Feature nova depois da V1",
    "Cloud, LiveKit, Mux, anúncio, equipe extra",
    "Passagem, hotel, alimentação",
    "Sociedade jurídica",
    "Percentual de receita (conversa depois)",
    "Abrir DNA, prompts e código antes do pagamento"
  ],
  extra: "Cloud, anúncio, viagem, audiovisual extra, novo curso, nova palestra: outro acordo, outro valor."
};

const TIMELINE_12 = [
  { when: "7 dias", what: "Kickoff. Mapa. Recorte da primeira obra por escrito." },
  { when: "30 dias", what: "Protótipo da Convergência clicável." },
  { when: "Até 31/12/2026", what: "V1 funcional: live de ponta a ponta + replay." },
  { when: "Q1 2027", what: "Onboarding, creators, testes, preparação de evento se houver data." },
  { when: "Q2 2027", what: "Ritmo de conteúdo e mentoria. Ajustes no que já foi aceito. Sem obra nova escondida." },
  { when: "Fim de 12 meses", what: "Chaves, revisão, decidir se existe segunda obra." }
];

const GARANTIA = {
  rule: "Dinheiro vira entrega. Entrega vira valor conquistado. Se parar no meio, discute só o que ainda não foi entregue.",
  example: "Se os marcos 01 a 04 foram aceitos (R$ 12.500), esse valor já virou trabalho e ativo. O restante (R$ 4.500) é o que se conversa.",
  clause:
    "A Founding Activation custa R$ 17.000 e corresponde aos oito marcos descritos. Cada marco, uma vez aceito por escrito, considera-se convertido em entrega. Em caso de interrupção, as partes discutem apenas marcos ainda não aceitos. Custos externos (nuvem, anúncio, deslocamento, equipe de terceiros) não estão inclusos. Este texto é comercial. Revisão de advogado antes de assinar."
};

const H72 = [
  "Comprovante do Pix (chave: preencher)",
  "Acesso proporcional à AF",
  "Data da primeira sessão",
  "Recorte da primeira obra em uma página",
  "O que NÃO entra, por escrito"
];

const MSG_FECHEI =
  "Francesca,\n\nfechamos a Founding Activation: 12 meses, R$ 17.000.\n\nNas próximas 72h: comprovante, acesso proporcional, data da primeira sessão, e o recorte da primeira obra por escrito.\n\nO que não entra: obra infinita, passagem, hotel, sociedade automática.\n\nYan";

const MSG_MARCOS =
  "Francesca,\n\nsegue o que os R$ 17.000 compram, em marcos:\n\n1. Arquitetura — R$ 2.000\n2. Protótipo — R$ 3.000\n3. Plataforma V1 — R$ 5.000\n4. Streaming, replay, admin — R$ 2.500\n5. Mentoria no teu campo — R$ 2.000\n6. Conteúdo (estrutura) — R$ 1.000\n7. Palestra 1 (sem viagem) — R$ 800\n8. Teste e chaves — R$ 700\n\nSoma: R$ 17.000.\n\nCada marco aceito fica conquistado. O que passar disso é outra obra.\n\nYan";

function marcosSoma() {
  return MARCOS_17K.reduce((s, m) => s + m.v, 0);
}

const DEAL_TEMPLATE = {
  title: "Modelo para o próximo fechamento",
  use: "Artur, Zé, empresa, investidor: mesmo esqueleto. Troca obra, valor, 72h. Não copia os 17 mil da Francesca.",
  slots: [
    "Quem é",
    "Qual a obra em uma frase",
    "Valor desta obra",
    "O que entra",
    "O que não entra",
    "Marcos que somam o valor",
    "Como sabemos que está pronto",
    "Garantia: só discute o que não foi entregue",
    "Mensagem do fechei",
    "72 horas"
  ]
};
