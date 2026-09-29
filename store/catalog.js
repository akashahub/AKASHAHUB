window.AKASHA_STORE = {
  functionsBase: "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1",
  wa: "5571983448621",
  successUrl: "https://akashahub.com.br/store/sucesso/",
  cancelUrl: "https://akashahub.com.br/store/",
  products: [
    { id: "teste-stripe", name: "Teste Stripe", desc: "Cobrança de teste. R$ 5 só para validar o checkout.", priceBRL: 5, type: "digital", group: "teste", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png", paymentLink: "", stripePriceId: "" },
    { id: "energia-sexual", name: "Mini curso Energia Sexual", desc: "PDF. Entrega após o pagamento.", priceBRL: 97, type: "digital", group: "digital", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png", paymentLink: "", stripePriceId: "" },
    { id: "zero-ao-zen", name: "Zero ao Zen - primeira edição", desc: "Livro PDF. Entrega após o pagamento.", priceBRL: 47, type: "digital", group: "digital", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png", paymentLink: "", stripePriceId: "" },
    { id: "codigos-de-origem", name: "Códigos de Origem", desc: "Livro digital. Entrega após o pagamento.", priceBRL: 97, type: "digital", group: "digital", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png", paymentLink: "", stripePriceId: "" },
    { id: "camiseta-akasha", name: "Camiseta Akasha", desc: "Peça física. Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png", paymentLink: "", stripePriceId: "" },
    { id: "banheira-go-arctic", name: "Banheira de Imersão em Gelo Go Arctic", desc: "Preço de teste no Stripe. Valor final pode ser alinhado no WhatsApp.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714204/01_banheira_go_arctic_h1ggwx.png", paymentLink: "", stripePriceId: "" },
    { id: "cafeteira-hyllis", name: "Cafeteira Portátil Hyllis", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714205/02_cafeteira_hyllis_sbrza0.png", paymentLink: "", stripePriceId: "" },
    { id: "escultura-anubis", name: "Escultura Decorativa Anubis", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714205/03_escultura_anubis_yfpiv1.png", paymentLink: "", stripePriceId: "" },
    { id: "kit-cristais-chakras", name: "Kit 7 Cristais Brutos dos Chakras", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714204/06_cristais_chakras_dhcop4.png", paymentLink: "", stripePriceId: "" },
    { id: "oleos-essenciais", name: "Coleção Óleos Essenciais Vitalize Aromas", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714202/07_oleos_essenciais_lqh84a.png", paymentLink: "", stripePriceId: "" },
    { id: "kit-ritual-limpeza", name: "Kit Ritual de Limpeza", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714203/08_ritual_limpeza_il1ns6.png", paymentLink: "", stripePriceId: "" },
    { id: "incensario-nirvana", name: "Incensário de Vidro Nirvana", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714202/09_incensario_nirvana_piyjha.png", paymentLink: "", stripePriceId: "" },
    { id: "japamala-sagrado", name: "Japamala Sagrado", desc: "Preço de teste no Stripe.", priceBRL: 10, type: "physical", group: "encomenda", image: "https://res.cloudinary.com/dcbarseus/image/upload/v1784714202/10_japamala_cnq9gi.png", paymentLink: "", stripePriceId: "" }
  ]
};

window.AKASHA_STORE.byId = function (id) {
  return window.AKASHA_STORE.products.find(function (p) { return p.id === id; }) || null;
};

window.AKASHA_STORE.waUrl = function (product, extra) {
  var p = typeof product === "string" ? window.AKASHA_STORE.byId(product) : product;
  var text = "Olá. Quero comprar pela Akasha Store";
  if (p) text += ": " + p.name + " (R$ " + p.priceBRL + ")";
  if (extra) text += ". " + extra;
  return "https://wa.me/" + window.AKASHA_STORE.wa + "?text=" + encodeURIComponent(text);
};

window.AKASHA_STORE.checkoutPage = function (id) {
  return "/store/checkout/?sku=" + encodeURIComponent(id);
};

window.AKASHA_STORE.startStripe = async function (opts) {
  var sku = opts.sku;
  var email = (opts.email || "").trim();
  var name = (opts.name || "").trim();
  var product = window.AKASHA_STORE.byId(sku);
  if (!product) throw new Error("Produto não encontrado.");
  if (product.paymentLink) {
    var url = product.paymentLink;
    if (email) url += (url.indexOf("?") >= 0 ? "&" : "?") + "prefilled_email=" + encodeURIComponent(email);
    location.href = url;
    return;
  }
  var res = await fetch(window.AKASHA_STORE.functionsBase + "/createStoreCheckout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: sku,
      email: email,
      name: name,
      success_url: window.AKASHA_STORE.successUrl + "?sku=" + encodeURIComponent(sku) + "&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: window.AKASHA_STORE.cancelUrl
    })
  });
  var data = {};
  try { data = await res.json(); } catch (e) {}
  if (res.status === 503) {
    throw new Error("Stripe ainda sem chave no servidor. Use o WhatsApp agora ou cole o Payment Link no catálogo.");
  }
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Não foi possível abrir o Stripe.");
  }
  location.href = data.url;
};
