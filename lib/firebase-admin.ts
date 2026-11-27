import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initFirebaseAdmin() {
  if (getApps().length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  // बिल्ड टाइम पर throw मत करो → सिर्फ runtime पर चेक करो
  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "Firebase Admin: Missing env vars (FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY)"
    );
    return;
  }

  try {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err) {
    console.error("Firebase Admin initialization failed:", err);
  }
}

initFirebaseAdmin();

export const adminAuth = getAuth();