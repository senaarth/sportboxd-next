"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let analytics;
let auth = {} as Auth;

if (firebaseConfig?.projectId) {
  app = initializeApp(firebaseConfig);

  if (app.name && typeof window !== "undefined") {
    analytics = getAnalytics(app);
    auth = getAuth(app);
  }
}

const getUserToken = async () => {
  return new Promise((resolve, _reject) => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const token = await getIdToken(user);
        resolve(token);
      } else {
        console.log("User not logged in");
        resolve(null);
      }
      unsub();
    });
  });
};

export { auth, app, analytics, getUserToken };
