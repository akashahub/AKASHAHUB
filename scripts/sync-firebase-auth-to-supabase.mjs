import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceAccountRaw || !supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT, SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const serviceAccount = JSON.parse(serviceAccountRaw);
const app = getApps()[0] || initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);

const users = [];
let pageToken;
do {
  const page = await auth.listUsers(1000, pageToken);
  users.push(...page.users);
  pageToken = page.pageToken;
} while (pageToken);

const rows = users.map((user) => ({
  firebase_uid: user.uid,
  email: user.email || null,
  display_name: user.displayName || null,
  photo_url: user.photoURL || null,
  created_at: user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : null,
  last_sign_in_at: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toISOString() : null,
  disabled: Boolean(user.disabled),
  providers: user.providerData.map((provider) => ({
    provider_id: provider.providerId,
    email: provider.email || null,
  })),
  synced_at: new Date().toISOString(),
}));

for (let i = 0; i < rows.length; i += 500) {
  const batch = rows.slice(i, i + 500);
  const response = await fetch(
    `${supabaseUrl}/rest/v1/ah_auth_directory?on_conflict=firebase_uid`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(batch),
    },
  );
  if (!response.ok) {
    throw new Error(`Supabase sync failed: ${response.status} ${(await response.text()).slice(0, 500)}`);
  }
}

console.log(`Synced ${rows.length} Firebase Authentication users to Supabase.`);
