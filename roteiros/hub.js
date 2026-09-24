function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function card(item) {
  const cls = "card" + (item.ref ? " is-ref" : "") + (item.pending ? " is-pending" : "");
  const inner =
    "<span class=\"card-meta\">" + esc(item.meta || (item.pending ? "em preparação" : "")) + "</span>" +
    "<span class=\"card-title\">" + esc(item.title) + "</span>" +
    "<span class=\"card-hook\">" + esc(item.hook || "") + "</span>";
  if (!item.href || item.pending) return "<div class=\"" + cls + "\">" + inner + "</div>";
  return "<a class=\"" + cls + "\" href=\"" + esc(item.href) + "\">" + inner + "</a>";
}

async function bootHub() {
  const root = document.getElementById("map");
  try {
    const response = await fetch("/roteiros/biblioteca.json?v=20260923b", { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    root.innerHTML = data.sections.map((section) =>
      "<section class=\"map-sec\"><h2>" + esc(section.title) + "</h2><p class=\"lead\">" + esc(section.lead) + "</p><div class=\"map-grid\">" +
      section.items.map(card).join("") +
      "</div></section>"
    ).join("");
  } catch (error) {
    root.innerHTML = "<p class=\"lead\">A biblioteca ainda não foi montada neste ambiente.</p>";
  }
}

bootHub();
