(function () {
  var LS_KEY = "af-entregas-state-v1";
  var ids = ["m1", "m2", "m3", "m4", "m5", "m6", "m7"];
  function loadScript() {
    var s = document.createElement("script");
    s.src = "entregas.js?v=entregas1";
    document.body.appendChild(s);
  }
  try {
    if (localStorage.getItem(LS_KEY)) { loadScript(); return; }
  } catch (e) {}
  Promise.all(ids.map(function (id) {
    return fetch("./modulos/" + id + ".json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  })).then(function (mods) {
    mods = mods.filter(Boolean);
    if (mods.length) {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ modulos: mods })); } catch (e) {}
    }
    loadScript();
  });
})();
