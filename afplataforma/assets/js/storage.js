/**
 * Abstração de armazenamento
 * localStorage = fallback / dados não sensíveis / DEV
 * Produção: preferir firestore.js
 */
const PREFIX = "afplataforma_v1_";

export const Store = {
  key(k) {
    return PREFIX + k;
  },
  get(k, fallback = null) {
    try {
      const v = localStorage.getItem(this.key(k));
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    localStorage.setItem(this.key(k), JSON.stringify(v));
  },
  saveUserToolData(uid, toolId, data) {
    const all = this.get("tools_" + uid, {});
    all[toolId] = { ...data, updatedAt: Date.now() };
    this.set("tools_" + uid, all);
  },
  getUserToolData(uid, toolId) {
    const all = this.get("tools_" + uid, {});
    return all[toolId] || null;
  },
  saveNotes(uid, text) {
    this.set("notes_" + uid, { text, updatedAt: Date.now() });
  },
  getNotes(uid) {
    return this.get("notes_" + uid, { text: "", updatedAt: null });
  },
  saveMentorNote(menteeId, text) {
    const all = this.get("mentor_notes", {});
    all[menteeId] = { text, updatedAt: Date.now() };
    this.set("mentor_notes", all);
  },
  getLang() {
    return localStorage.getItem(this.key("lang")) || "pt-BR";
  },
  setLang(l) {
    localStorage.setItem(this.key("lang"), l);
  },
  getProfile(uid) {
    return this.get("profile_" + uid, null);
  },
  setProfile(uid, data) {
    this.set("profile_" + uid, data);
  }
};
