window.AKASHA_STORE = {
  functionsBase: "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1",
  wa: "5571983448621",
  successUrl: "https://akashahub.com.br/store/sucesso/",
  cancelUrl: "https://akashahub.com.br/store/",
  products: [
    {
      id: "energia-sexual",
      name: "Mini curso Energia Sexual",
      desc: "PDF. Força vital, limite, presença e poder pessoal. Entrega imediata após o pagamento.",
      priceBRL: 97,
      type: "digital",
      image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png",
      paymentLink: "",
      stripePriceId: ""
    },
    {
      id: "zero-ao-zen",
      name: "Zero ao Zen — primeira edição",
      desc: "Livro PDF. Do zero ao legado. Entrega imediata após o pagamento.",
      priceBRL: 47,
      type: "digital",
      image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png",
      paymentLink: "",
      stripePriceId: ""
    },
    {
      id: "codigos-de-origem",
      name: "Códigos de Origem",
      desc: "Livro. Mente, corpo e campo. Entrega digital após o pagamento.",
      priceBRL: 97,
      type: "digital",
      image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png",
      paymentLink: "",
      stripePriceId: ""
    },
    {
      id: "camiseta-akasha",
      name: "Camiseta Akasha",
      desc: "Peça física. Frete combinado no checkout ou no WhatsApp.",
      priceBRL: 129,
      type: "physical",
      image: "https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png",
      paymentLink: "",
      stripePriceId: ""
    }
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
