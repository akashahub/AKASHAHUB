/* SPAVO Digital — demo visual */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));

  window.showToast = function (msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
  };

  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.contact_name.value.trim();
      const email = form.contact_email.value.trim();
      const phone = form.contact_phone.value.trim();
      if (!name) { showToast("Informe seu nome."); return; }
      if (!email && !phone) { showToast("Informe e-mail ou telefone."); return; }
      const box = document.getElementById("form-result");
      if (box) {
        box.innerHTML = '<div class="alert alert-success"><strong>Solicitação enviada</strong> (simulação).</div>';
        form.reset();
      }
      showToast("Reserva solicitada · demo");
    });
  }

  const login = document.getElementById("login-form");
  if (login) {
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Entrando no painel (demo)…");
      setTimeout(() => { window.location.href = "painel.html"; }, 500);
    });
  }

  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      const row = this.closest("tr");
      const badge = row && row.querySelector(".status-badge");
      if (!badge) return;
      if (action === "approve") { badge.className = "badge badge-approved status-badge"; badge.textContent = "Aprovada"; showToast("Aprovada (demo)"); }
      else if (action === "reject") { badge.className = "badge badge-rejected status-badge"; badge.textContent = "Recusada"; showToast("Recusada (demo)"); }
      else if (action === "confirm") { badge.className = "badge badge-confirmed status-badge"; badge.textContent = "Confirmada"; showToast("Confirmada (demo)"); }
      else if (action === "cancel") { badge.className = "badge badge-cancelled status-badge"; badge.textContent = "Cancelada"; showToast("Cancelada (demo)"); }
    });
  });
})();
