window.AKASHA_SAAS = {
  functionsBase: "https://us-central1-hub-akasha.cloudfunctions.net",
  plans: [
    { id: "anubis", nivel: 1, name: "Anúbis", subtitle: "Faixa azul", priceLabel: "US$ 34 / mês", priceUsd: 34 },
    { id: "horus", nivel: 2, name: "Hórus", subtitle: "Faixa roxa", priceLabel: "US$ 65 / mês", priceUsd: 65 },
    { id: "isis", nivel: 3, name: "Ísis", subtitle: "Faixa marrom", priceLabel: "US$ 517 / mês", priceUsd: 517 },
    { id: "amonra", nivel: 4, name: "Amon-Rá", subtitle: "Faixa preta", priceLabel: "US$ 1.032 / mês", priceUsd: 1032 },
  ],
};

window.AKASHA_SAAS.planById = function (id) {
  return window.AKASHA_SAAS.plans.find((p) => p.id === id) || null;
};

window.AKASHA_SAAS.planByNivel = function (nivel) {
  return window.AKASHA_SAAS.plans.find((p) => p.nivel === Number(nivel)) || null;
};

window.AKASHA_SAAS.checkoutUrl = function (planId) {
  return "/members/checkout/?plan=" + encodeURIComponent(planId);
};
