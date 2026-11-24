// lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // FIX: Env vars missing hone par साफ़ error do — chup-chaap fail mat karo
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin env vars missing. Zaroori hai: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminAuth = admin.auth();