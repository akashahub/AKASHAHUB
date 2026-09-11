/**
 * Firebase do projeto hub-akasha (já usado pela AF).
 * Chave web pública — autorização real está nas regras do Firestore.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
  authDomain: "hub-akasha.firebaseapp.com",
  projectId: "hub-akasha",
  storageBucket: "hub-akasha.firebasestorage.app",
  messagingSenderId: "370851875474",
  appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b"
};

export const SUPER_ADMINS = [
  "yanfili.simon@gmail.com",
  "srklehn@gmail.com"
];

export const COL_ACCESS = "isaacAccess";
export const COL_INST = "isaacInstitutions";
export const COL_REF = "isaacReferrals";

export function emailKey(email) {
  return String(email || "").trim().toLowerCase();
}

export function isSuperAdmin(email) {
  return SUPER_ADMINS.includes(emailKey(email));
}
