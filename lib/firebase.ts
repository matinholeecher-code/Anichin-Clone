import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMQXkOW8uFBwq8XMdALgd4jITe1p94rYw",
  authDomain: "anichin-clone-c1954.firebaseapp.com",
  databaseURL: "https://anichin-clone-c1954-default-rtdb.firebaseio.com",
  projectId: "anichin-clone-c1954",
  storageBucket: "anichin-clone-c1954.firebasestorage.app",
  messagingSenderId: "479045873518",
  appId: "1:479045873518:web:8dbbfe29f1cb1f660e5b7f",
  measurementId: "G-JTSH6HXV09",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);

export const ADMIN_UID = "rs9Ld1vES9YhSbEyyoS0xrULQ4d2";
