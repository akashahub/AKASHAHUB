/* Akasha Hub - um arquivo só. ID de medição GA4. */
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


/* Experiências Transcendentais - carregamento isolado apenas na home. */
(function () {
  var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;
  if (document.querySelector('script[data-ah-experiencias]')) return;
  var s = document.createElement('script');
  s.src = '/js/experiencias-transcendentais.js?v=1';
  s.defer = true;
  s.dataset.ahExperiencias = '1';
  document.head.appendChild(s);
})();
