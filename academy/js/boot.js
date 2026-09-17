import { TENANT, EVENT, isCeoEmail } from './domain.js';
import { createStore, persistFirestore } from './store.js';
import { joinLive } from './live.js';
import { render } from './ui.js';

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4',
    authDomain: 'hub-akasha.firebaseapp.com',
    projectId: 'hub-akasha',
    storageBucket: 'hub-akasha.firebasestorage.app',
    messagingSenderId: '370851875474',
    appId: '1:370851875474:web:29b1ba3a76b0fed7d9344b'
  });
} catch (e) {}

const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;
if (auth) auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

const root = document.getElementById('app');
const store = createStore({
  onPersist: function (state) {
    persistFirestore(db, state).then(function (flag) {
      if (flag !== state.cloud) store.patch({ cloud: flag });
    });
  }
});

const ctx = {
  store: store,
  route: 'gate',
  go: function (r) {
    ctx.route = r || 'inicio';
    location.hash = ctx.route;
    ctx.draw();
  },
  draw: function () { render(root, ctx); },
  loginGoogle: async function () {
    if (!auth) return;
    const p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    try {
      const cred = await auth.signInWithPopup(p);
      const u = cred.user;
      store.patch({
        uid: u.uid,
        email: u.email || '',
        name: u.displayName || store.get().name,
        role: store.get().role || (isCeoEmail(u.email) ? 'matriz' : store.get().role)
      });
      ctx.go(store.get().role ? 'inicio' : 'gate');
    } catch (e) {
      if (e.code === 'auth/popup-blocked') { await auth.signInWithRedirect(p); return; }
    }
  },
  startLive: async function () {
    const st = store.get();
    try {
      await joinLive({
        el: document.getElementById('livebox'),
        uid: st.uid,
        role: st.role,
        name: st.name,
        room: EVENT.liveRoom
      });
    } catch (e) {
      const box = document.getElementById('livebox');
      if (box) box.textContent = 'Live demo: ' + (e.message || e);
    }
  }
};

if (auth) {
  auth.onAuthStateChanged(function (u) {
    if (!u) return;
    store.patch({
      uid: u.uid,
      email: u.email || store.get().email,
      name: store.get().name || u.displayName || '',
      role: store.get().role || (isCeoEmail(u.email) ? 'matriz' : null)
    });
  });
}

window.addEventListener('hashchange', function () {
  const h = (location.hash || '').replace('#', '');
  if (h) { ctx.route = h; ctx.draw(); }
});

ctx.route = (location.hash || '').replace('#', '') || (store.get().role ? 'inicio' : 'gate');
document.title = TENANT.name;
ctx.draw();
