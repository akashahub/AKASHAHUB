/**
 * Quem pode abrir /sessoes.
 * A lista fica em posts/sessoesAllow, que o mentor já pode gravar
 * e qualquer login já pode ler. Não mexe no acesso da AF.
 */
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { isMentorSession } from "./auth.js";
import { esc } from "./navigation.js?v=rt14";

const ref = doc(db, "posts", "sessoesAllow");

function norm(email) {
  return String(email || "").trim().toLowerCase();
}

function valid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readEmails() {
  const snap = await getDoc(ref);
  const raw = snap.exists() ? snap.data().emails : [];
  return Array.isArray(raw) ? raw.map(norm).filter(Boolean) : [];
}

async function writeEmails(emails) {
  await setDoc(ref, {
    tipo: "acesso-sessoes",
    emails: [...new Set(emails.map(norm).filter(Boolean))],
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function renderSessoesAccess() {
  if (!isMentorSession()) return "";
  return `<section id="sessoesAccess" style="margin-top:28px">
    <p class="hero-line">Sessões da mentoria</p>
    <h3 class="section-h">Quem entra em /sessoes</h3>
    <p class="hero-sub">Digite o e-mail ou Gmail de quem já pagou. Depois do login, só esse e-mail abre as sessões. O resto da plataforma não muda.</p>
    <div class="field" style="max-width:420px">
      <label for="sessoesEmail">E-mail</label>
      <input id="sessoesEmail" type="email" placeholder="nome@gmail.com" autocomplete="off">
    </div>
    <button class="tool-btn" type="button" id="sessoesGrant">Liberar</button>
    <p class="notes-hint" id="sessoesHint">Carregando a lista…</p>
    <div id="sessoesList"></div>
  </section>`;
}

export function bindSessoesAccess() {
  if (!isMentorSession()) return;
  const hint = document.getElementById("sessoesHint");
  const list = document.getElementById("sessoesList");
  const input = document.getElementById("sessoesEmail");
  const grant = document.getElementById("sessoesGrant");
  if (!hint || !list || !grant) return;

  function paint(emails) {
    if (!emails.length) {
      list.innerHTML = "";
      hint.textContent = "Ninguém liberado ainda.";
      return;
    }
    hint.textContent = emails.length + (emails.length === 1 ? " e-mail liberado." : " e-mails liberados.");
    list.innerHTML = emails.map((email) =>
      `<p style="display:flex;gap:10px;align-items:center;justify-content:space-between;max-width:420px;margin:8px 0">
        <span>${esc(email)}</span>
        <button class="tool-btn" type="button" data-sessoes-remove="${esc(email)}">Tirar</button>
      </p>`
    ).join("");
  }

  async function load() {
    try {
      paint(await readEmails());
    } catch (e) {
      hint.textContent = "Não consegui ler a lista. Entra de novo com a conta do mentor.";
    }
  }

  grant.addEventListener("click", async () => {
    const email = norm(input.value);
    if (!valid(email)) {
      hint.textContent = "Escreve um e-mail completo, com @.";
      return;
    }
    grant.disabled = true;
    try {
      const emails = await readEmails();
      if (!emails.includes(email)) emails.push(email);
      await writeEmails(emails);
      input.value = "";
      paint(emails);
    } catch (e) {
      hint.textContent = "Não gravei. Usa a conta principal do mentor e tenta de novo.";
    }
    grant.disabled = false;
  });

  list.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("[data-sessoes-remove]");
    if (!btn) return;
    const email = norm(btn.getAttribute("data-sessoes-remove"));
    btn.disabled = true;
    try {
      const emails = (await readEmails()).filter((item) => item !== email);
      await writeEmails(emails);
      paint(emails);
    } catch (e) {
      hint.textContent = "Não consegui tirar esse e-mail agora.";
      btn.disabled = false;
    }
  });

  load();
}
