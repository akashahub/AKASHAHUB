import { esc } from "./navigation.js";
import { session } from "./auth.js";
import { Store } from "./storage.js";

// Banco nutricional educativo inicial (valores de referência aproximados por 100g ou porção indicada).
// Fonte de referência: tabelas públicas de composição de alimentos (TBCA/TACO ou equivalentes).
// Não constitui orientação nutricional individualizada.
const FOODS = [
  { id:"arroz-cozido", name:"Arroz branco cozido", category:"Cereais", portion:"100 g", kcal:128, protein:2.5, carbs:28, fat:0.3, fiber:0.4 },
  { id:"feijao-cozido", name:"Feijão carioca cozido", category:"Leguminosas", portion:"100 g", kcal:76, protein:4.8, carbs:14, fat:0.5, fiber:8.5 },
  { id:"frango-grelhado", name:"Peito de frango grelhado", category:"Proteínas", portion:"100 g", kcal:159, protein:32, carbs:0, fat:3.2, fiber:0 },
  { id:"ovo-cozido", name:"Ovo cozido", category:"Proteínas", portion:"1 unidade (50 g)", kcal:78, protein:6.3, carbs:0.6, fat:5.3, fiber:0 },
  { id:"banana", name:"Banana nanica", category:"Frutas", portion:"1 unidade média (100 g)", kcal:92, protein:1.3, carbs:24, fat:0.1, fiber:2.6 },
  { id:"batata-doce", name:"Batata-doce cozida", category:"Tubérculos", portion:"100 g", kcal:77, protein:0.6, carbs:18, fat:0.1, fiber:2.2 },
  { id:"brocolis", name:"Brócolis cozido", category:"Vegetais", portion:"100 g", kcal:35, protein:2.4, carbs:7, fat:0.4, fiber:3.3 },
  { id:"aveia", name:"Aveia em flocos", category:"Cereais", portion:"30 g", kcal:114, protein:4.2, carbs:19, fat:2.4, fiber:3.1 },
  { id:"iogurte-natural", name:"Iogurte natural integral", category:"Laticínios", portion:"100 g", kcal:61, protein:3.5, carbs:4.7, fat:3.3, fiber:0 },
  { id:"azeite", name:"Azeite de oliva", category:"Gorduras", portion:"1 colher de sopa (10 g)", kcal:90, protein:0, carbs:0, fat:10, fiber:0 },
  { id:"amendoim", name:"Amendoim torrado", category:"Oleaginosas", portion:"30 g", kcal:172, protein:7.5, carbs:6, fat:14, fiber:2.4 },
  { id:"queijo-minas", name:"Queijo minas frescal", category:"Laticínios", portion:"30 g", kcal:70, protein:5.5, carbs:1, fat:5, fiber:0 },
  { id:"maca", name:"Maçã com casca", category:"Frutas", portion:"1 unidade média (150 g)", kcal:78, protein:0.4, carbs:21, fat:0.2, fiber:3.6 },
  { id:"lentilha", name:"Lentilha cozida", category:"Leguminosas", portion:"100 g", kcal:116, protein:9, carbs:20, fat:0.4, fiber:7.9 },
  { id:"atum-lata", name:"Atum em conserva", category:"Proteínas", portion:"100 g", kcal:128, protein:26, carbs:0, fat:1.5, fiber:0 }
];

function navHead(kicker, title, sub) {
  return `<button class="corpo-back" type="button" data-nav="corpo:nutricao">← Nutrição e Autonomia Alimentar</button>
    <section class="corpo-area-hero"><span>${kicker}</span><h1>${title}</h1><p>${sub}</p></section>`;
}

function foodCard(f) {
  return `<article class="ct-exercise" data-food="${f.id}">
    <span>${esc(f.category)} · ${esc(f.portion)}</span>
    <h3>${esc(f.name)}</h3>
    <p><b>${f.kcal}</b> kcal · P ${f.protein}g · C ${f.carbs}g · G ${f.fat}g · Fibra ${f.fiber}g</p>
  </article>`;
}

export function renderCorpoNutricaoSpace(slug) {
  if (slug !== "alimentos-e-propriedades") return null;
  return `<div class="view active corpo-view ct-view">
    ${navHead("NUTRIÇÃO · BANCO", "Banco de alimentos", "Referência educativa de composição. Valores aproximados por porção indicada.")}
    <div class="ct-panel" style="margin-bottom:16px">
      <input id="foodSearch" type="search" placeholder="Buscar alimento..." style="width:100%;padding:12px;border:1px solid var(--line);border-radius:4px;background:var(--bg);color:var(--text);font:inherit">
      <p class="ct-note" style="margin-top:10px">Valores de referência aproximados. Não constituem orientação nutricional individualizada. Fonte de base: tabelas públicas de composição de alimentos.</p>
    </div>
    <div class="ct-library" id="foodList">${FOODS.map(foodCard).join("")}</div>
    <p class="ct-note">Este banco é educativo e pode ser expandido. Não substitui avaliação nutricional profissional.</p>
  </div>`;
}

export function bindCorpoNutricao() {
  const root = document.getElementById("content");
  const search = root?.querySelector("#foodSearch");
  const list = root?.querySelector("#foodList");
  if (!search || !list) return;
  search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    const filtered = q ? FOODS.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) : FOODS;
    list.innerHTML = filtered.length ? filtered.map(foodCard).join("") : '<p class="ct-empty">Nenhum alimento encontrado.</p>';
  });
}
