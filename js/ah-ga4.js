/* Akasha Hub — um arquivo só. ID de medição GA4. */
(function () {
  var ID = "G-TG0XJE0ZWS";
  if (!ID || ID.indexOf("G-") !== 0 || ID.length < 10) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", ID);
})();
