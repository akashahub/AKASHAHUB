/**
 * Biblioteca compartilhada de cursos e aulas da camada Investimentos & Mercados.
 * O catálogo fica no Firestore. Somente mentor autorizado pode editar conteúdo.
 */
import {
  collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db, isMentorIdentity } from "../../firebase/firebase-config.js";
import { session, isMentorSession } from "./auth.js";
import { esc } from "./navigation.js?v=rt47";

const COURSES = "afLearningCourses";
let playerModal = null;
let busy = false;

function isRealMentor() {
  return session.mode === "firebase" && Boolean(session.uid)
    && (isMentorSession() || isMentorIdentity(session.uid, session.email));
}
function hasRealSession() {
  return session.mode === "firebase" && Boolean(session.uid);
}
function injectStyles() {
  if (document.getElementById("invCourseStyles")) return;
  const style = document.createElement("style");
  style.id = "invCourseStyles";
  style.textContent = `
    .inv-course-manager,.inv-course-card{border:1px solid var(--line);border-radius:6px;padding:14px;margin:10px 0 16px;background:rgba(201,162,39,.035)}
    .inv-course-card h4{font-family:var(--font-d);font-size:1.25rem;font-weight:500;margin:0 0 6px}
    .inv-course-card p{color:var(--muted);font-size:13px;line-height:1.6;margin:4px 0 10px}
    .inv-video-list{display:grid;gap:8px;margin:12px 0}
    .inv-video-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--line);border-radius:4px;padding:10px;min-width:0}
    .inv-video-meta{min-width:0;flex:1}.inv-video-meta strong{display:block;font-size:13px;font-weight:600}
    .inv-video-meta span{display:block;font-size:11px;color:var(--muted);margin-top:3px}
    .inv-video-actions,.inv-course-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    .inv-video-form{border-top:1px solid var(--line);padding-top:12px;margin-top:12px}
    .inv-course-status{font-size:12px;color:var(--muted);margin:8px 0}
    .inv-player-backdrop{position:fixed;inset:0;z-index:10050;background:rgba(5,4,8,.88);display:flex;align-items:center;justify-content:center;padding:18px}
    .inv-player-dialog{width:min(100%,960px);max-height:94vh;overflow:auto;background:#17141d;color:#f7f2e8;border:1px solid rgba(201,162,39,.5);border-radius:8px;box-shadow:0 25px 80px rgba(0,0,0,.5)}
    .inv-player-head{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 18px;border-bottom:1px solid rgba(201,162,39,.22)}
    .inv-player-title{font-family:var(--font-d,serif);font-size:1.35rem;margin:0;overflow-wrap:anywhere}
    .inv-player-close{border:1px solid rgba(201,162,39,.45);background:transparent;color:inherit;border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer;flex:0 0 auto}
    .inv-player-stage{aspect-ratio:16/9;background:#000;width:100%}.inv-player-stage iframe{width:100%;height:100%;border:0;display:block}
    .inv-player-foot{font-size:11px;color:#b8b0c2;padding:10px 18px 14px}
    @media(max-width:600px){.inv-player-backdrop{padding:8px}.inv-player-dialog{max-height:90vh}.inv-player-title{font-size:1.1rem}.inv-video-row{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(style);
}
function parseYoutubeVideoId(raw) {
  const value = String(raw || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  let url;
  try { url = new URL(value); } catch { return ""; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return "";
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!["youtube.com","m.youtube.com","music.youtube.com","youtu.be","youtube-nocookie.com"].includes(host)) return "";
  let id = "";
  if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
  else {
    id = url.searchParams.get("v") || "";
    if (!id) {
      const parts = url.pathname.split("/").filter(Boolean);
      const key = parts.findIndex((part) => ["embed","shorts","live"].includes(part));
      if (key >= 0) id = parts[key + 1] || "";
    }
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
}
function safeText(value, max = 300) { return String(value || "").trim().slice(0, max); }

function renderManagerForm() {
  if (!isRealMentor()) return "";
  return `<div class="inv-course-manager">
    <p class="hero-line">Área do mentor · edição de conteúdo</p>
    <h4 style="margin:0 0 6px">Criar curso ou trilha</h4>
    <p>Cadastre o curso e adicione as aulas pelo link do YouTube. O link não aparece como texto na biblioteca do aluno.</p>
    <form id="invCreateCourseForm">
      <div class="grid-3">
        <div class="field"><label for="invCourseTitle">Nome do curso</label><input id="invCourseTitle" name="title" maxlength="100" required placeholder="Ex.: Fundamentos de Bolsa"></div>
        <div class="field"><label for="invCourseDescription">Descrição</label><input id="invCourseDescription" name="description" maxlength="240" placeholder="O que a pessoa vai aprender"></div>
      </div>
      <button class="tool-btn primary" type="submit">Criar curso</button>
      <p class="inv-course-status" id="invCourseCreateStatus" role="status" aria-live="polite"></p>
    </form>
  </div>`;
}
function renderVideoForm(course) {
  if (!isRealMentor()) return "";
  return `<form class="inv-video-form" data-add-video-form data-course-id="${esc(course.id)}">
    <h5 style="margin:0 0 10px;font-size:13px">Adicionar aula a este curso</h5>
    <div class="grid-3">
      <div class="field"><label>Título da aula</label><input name="title" maxlength="120" required placeholder="Ex.: O que é valuation"></div>
      <div class="field"><label>Link do YouTube ou ID do vídeo</label><input name="videoUrl" maxlength="500" required placeholder="Cole o link do YouTube aqui"></div>
      <div class="field"><label>Resumo (opcional)</label><input name="description" maxlength="240" placeholder="O assunto desta aula"></div>
    </div>
    <div class="inv-course-actions"><button class="tool-btn primary" type="submit">Guardar aula</button></div>
    <p class="inv-course-status" data-course-status role="status" aria-live="polite"></p>
  </form>`;
}
function renderVideos(videos, course) {
  if (!videos.length) return '<p class="notes-hint">Ainda não há aulas neste curso.</p>';
  return `<div class="inv-video-list">${videos.map((video) => `
    <article class="inv-video-row">
      <div class="inv-video-meta"><strong>${esc(video.title)}</strong>${video.description ? `<span>${esc(video.description)}</span>` : ""}</div>
      <div class="inv-video-actions">
        <button class="tool-btn primary" type="button" data-play-video="${esc(video.videoId)}" data-video-title="${esc(video.title)}">▶ Assistir aula</button>
        ${isRealMentor() ? `<button class="tool-btn" type="button" data-remove-video="${esc(video.id)}" data-course-id="${esc(course.id)}">Remover</button>` : ""}
      </div>
    </article>`).join("")}</div>`;
}
function renderCourseCards(courses) {
  if (!courses.length) return '<div class="inv-course-card"><h4>Biblioteca em construção</h4><p>Nenhum curso foi cadastrado ainda. A área está pronta para receber as aulas.</p></div>';
  return courses.map((course) => `<article class="inv-course-card">
    <p class="hero-line">Curso · ${course.videos.length} aula(s)</p>
    <h4>${esc(course.title)}</h4>${course.description ? `<p>${esc(course.description)}</p>` : ""}
    ${renderVideos(course.videos, course)}${renderVideoForm(course)}
  </article>`).join("");
}
export function renderCursos() {
  injectStyles();
  return `<section id="invCourseLibrary">
    ${renderManagerForm()}
    <div id="invCoursesStatus" class="inv-course-status" role="status" aria-live="polite">Carregando biblioteca de cursos…</div>
    <div id="invCoursesList"><div class="inv-course-card"><p>Os cursos aparecerão aqui.</p></div></div>
    <p class="notes-hint">Aula em player incorporado do YouTube; o link não aparece como texto na experiência do aluno. Como qualquer player web, a incorporação pode ser inspecionada tecnicamente no navegador. Vídeos cujo proprietário bloqueia a incorporação podem não tocar dentro da plataforma.</p>
  </section>`;
}
async function loadCourses() {
  const snap = await getDocs(collection(db, COURSES));
  return Promise.all(snap.docs.map(async (courseDoc) => {
    const data = courseDoc.data() || {};
    const videoSnap = await getDocs(collection(db, COURSES, courseDoc.id, "videos"));
    const videos = videoSnap.docs.map((videoDoc) => ({ id: videoDoc.id, ...(videoDoc.data() || {}) }))
      .filter((video) => /^[A-Za-z0-9_-]{11}$/.test(String(video.videoId || "")))
      .sort((a,b) => Number(a.order || 0) - Number(b.order || 0));
    return { id: courseDoc.id, ...data, videos };
  })).then((courses) => courses.filter((course) => course.active !== false)
    .sort((a,b) => Number(a.order || 0) - Number(b.order || 0) || String(a.title || "").localeCompare(String(b.title || ""),"pt-BR")));
}
function setStatus(root, message, isError = false) {
  const el = root?.querySelector("#invCoursesStatus");
  if (el) { el.textContent = message; el.dataset.state = isError ? "error" : "ok"; }
}
function openPlayer(videoId, title) {
  closePlayer();
  injectStyles();
  const backdrop = document.createElement("div");
  backdrop.className = "inv-player-backdrop";
  const dialog = document.createElement("section");
  dialog.className = "inv-player-dialog";
  dialog.setAttribute("role","dialog");
  dialog.setAttribute("aria-modal","true");
  dialog.setAttribute("aria-label",title);
  const head = document.createElement("header");
  head.className = "inv-player-head";
  const heading = document.createElement("h3");
  heading.className = "inv-player-title";
  heading.textContent = title;
  const close = document.createElement("button");
  close.className = "inv-player-close";
  close.type = "button";
  close.setAttribute("aria-label","Fechar vídeo");
  close.textContent = "×";
  head.append(heading,close);
  const stage = document.createElement("div");
  stage.className = "inv-player-stage";
  const iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(videoId) + "?autoplay=1&rel=0&playsinline=1";
  iframe.title = title;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  stage.appendChild(iframe);
  const foot = document.createElement("p");
  foot.className = "inv-player-foot";
  foot.textContent = "Aula da biblioteca Zero ao Zen Negócios";
  dialog.append(head,stage,foot);
  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";
  playerModal = backdrop;
  const onKey = (event) => { if (event.key === "Escape") closePlayer(); };
  document.addEventListener("keydown",onKey);
  backdrop._invOnKey = onKey;
  backdrop.addEventListener("click",(event) => { if (event.target === backdrop) closePlayer(); });
  close.addEventListener("click",closePlayer);
  close.focus();
}
function closePlayer() {
  if (!playerModal) return;
  if (playerModal._invOnKey) document.removeEventListener("keydown",playerModal._invOnKey);
  playerModal.remove();
  playerModal = null;
  document.body.style.overflow = "";
}
async function refreshLibrary(root) {
  const list = root.querySelector("#invCoursesList");
  if (list) list.innerHTML = '<div class="inv-course-card"><p>Carregando cursos e aulas…</p></div>';
  if (!hasRealSession()) {
    if (list) list.innerHTML = "";
    setStatus(root,"Entre com uma conta real da AF para acessar a biblioteca compartilhada.",true);
    return;
  }
  try {
    const courses = await loadCourses();
    if (!root.isConnected) return;
    if (list) list.innerHTML = renderCourseCards(courses);
    setStatus(root,courses.length ? "Biblioteca carregada." : "Biblioteca pronta para receber o primeiro curso.");
  } catch (error) {
    console.warn("[Investimentos] Falha ao carregar cursos:",error?.code || error?.message || error);
    if (list) list.innerHTML = '<div class="inv-course-card"><h4>Conteúdo ainda indisponível</h4><p>Confira se as regras novas da biblioteca foram publicadas no Firebase e se a conta tem acesso ativo à AF.</p></div>';
    setStatus(root,"Não foi possível abrir a biblioteca compartilhada. Nada foi apagado; verifique as regras de acesso no Firebase.",true);
  }
}
export function bindCursos() {
  const root = document.getElementById("invCourseLibrary");
  if (!root || root.dataset.bound === "1") return;
  root.dataset.bound = "1";
  injectStyles();
  root.addEventListener("submit",async (event) => {
    const courseForm = event.target.closest("#invCreateCourseForm");
    const videoForm = event.target.closest("[data-add-video-form]");
    if (!courseForm && !videoForm) return;
    event.preventDefault();
    if (!isRealMentor()) { setStatus(root,"Somente o mentor autorizado pode cadastrar cursos e aulas.",true); return; }
    if (busy) return;
    busy = true;
    const form = courseForm || videoForm;
    const button = event.submitter || form.querySelector('button[type="submit"]');
    const originalLabel = button?.textContent || "";
    if (button) { button.disabled = true; button.textContent = "Salvando…"; }
    try {
      if (courseForm) {
        const title = safeText(courseForm.elements.title?.value,100);
        const description = safeText(courseForm.elements.description?.value,240);
        if (!title) throw new Error("Dê um nome para o curso.");
        const slug = title.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55);
        const id = slug + "-" + Date.now().toString(36);
        await setDoc(doc(db,COURSES,id),{title,description,order:Date.now(),active:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
        courseForm.reset();
        const status = root.querySelector("#invCourseCreateStatus");
        if (status) status.textContent = "Curso criado e publicado na biblioteca.";
      } else {
        const courseId = videoForm.dataset.courseId;
        const title = safeText(videoForm.elements.title?.value,120);
        const videoId = parseYoutubeVideoId(safeText(videoForm.elements.videoUrl?.value,500));
        const description = safeText(videoForm.elements.description?.value,240);
        if (!title) throw new Error("Dê um título para a aula.");
        if (!videoId) throw new Error("Cole um link válido do YouTube ou um ID de vídeo com 11 caracteres.");
        const id = "video-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6);
        await setDoc(doc(db,COURSES,courseId,"videos",id),{title,description,videoId,order:Date.now(),createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
        videoForm.reset();
        const status = videoForm.querySelector("[data-course-status]");
        if (status) status.textContent = "Aula adicionada ao curso.";
      }
      await refreshLibrary(root);
    } catch (error) {
      console.warn("[Investimentos] Falha ao salvar biblioteca:",error?.code || error?.message || error);
      const message = error?.code === "permission-denied" ? "O Firebase recusou a gravação. Confirme se as regras da nova biblioteca foram publicadas." : (error?.message || "Não foi possível salvar. Tente novamente.");
      const status = courseForm ? root.querySelector("#invCourseCreateStatus") : videoForm?.querySelector("[data-course-status]");
      if (status) status.textContent = message;
    } finally {
      busy = false;
      if (button) { button.disabled = false; button.textContent = originalLabel; }
    }
  });
  root.addEventListener("click",async (event) => {
    const play = event.target.closest("[data-play-video]");
    if (play) { openPlayer(play.dataset.playVideo,play.dataset.videoTitle || "Aula"); return; }
    const remove = event.target.closest("[data-remove-video]");
    if (!remove || !isRealMentor() || busy) return;
    if (!window.confirm("Remover esta aula da biblioteca? O vídeo original no YouTube não será apagado.")) return;
    busy = true;
    remove.disabled = true;
    try {
      await deleteDoc(doc(db,COURSES,remove.dataset.courseId,"videos",remove.dataset.removeVideo));
      await refreshLibrary(root);
    } catch (error) {
      console.warn("[Investimentos] Falha ao remover aula:",error?.code || error?.message || error);
      setStatus(root,"Não foi possível remover esta aula. Verifique o acesso ao Firebase.",true);
    } finally {
      busy = false;
    }
  });
  refreshLibrary(root);
}
