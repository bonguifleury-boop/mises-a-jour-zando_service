// src/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDS0Dx93q0iKWK0tRW2D-IqTIyK9DnxgQg",
  authDomain: "marche-b74b8.firebaseapp.com",
  projectId: "marche-b74b8",
  storageBucket: "marche-b74b8.firebasestorage.app",
  messagingSenderId: "634277294546",
  appId: "1:634277294546:web:89a09988cf58546a6c580b",
  measurementId: "G-RXTEVEQ2KQ",
};

const app = initializeApp(firebaseConfig);

export default app;
