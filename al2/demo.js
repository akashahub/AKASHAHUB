(function () {
  const n = document.getElementById("reservas");
  document.querySelectorAll("[data-slot]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("on");
      if (n) n.textContent = String(document.querySelectorAll("[data-slot].on").length);
    });
  });
})();
