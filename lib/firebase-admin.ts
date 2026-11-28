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

  // Key saaf karo: quotes hatao, \n text ko asli newline banao
  privateKey = privateKey
    .replace(/\\n/g, "\n")
    .replace(/"/g, "")
    .trim();

  // Body nikalo: header/footer aur saari whitespace hatao,
  // phir 64-character ki lines me dobara sahi PEM format banao
  const keyBody = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const keyLines = keyBody.match(/.{1,64}/g) || [];
  privateKey =
    "-----BEGIN PRIVATE KEY-----\n" +
    keyLines.join("\n") +
    "\n-----END PRIVATE KEY-----\n";

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