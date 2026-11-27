import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | undefined;
let auth: Auth | undefined;

function getFirebaseApp(): App {
  if (app) return app;

  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin env vars missing: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    );
  }

  // Vercel में अक्सर key इस तरह आती है → clean करो
  privateKey = privateKey
    .replace(/\\n/g, "\n")
    .replace(/"/g, "")
    .trim();

  // अगर BEGIN/END missing है तो जोड़ दो (कभी-कभी लोग सिर्फ key body डाल देते हैं)
  if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
  }

  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return app;
}

export function getAdminAuth(): Auth {
  if (!auth) {
    getFirebaseApp(); // initialize only when needed
    auth = getAuth();
  }
  return auth;
}

// पुराने कोड के साथ compatibility के लिए
export const adminAuth = {
  verifyIdToken: (...args: Parameters<Auth["verifyIdToken"]>) =>
    getAdminAuth().verifyIdToken(...args),
};