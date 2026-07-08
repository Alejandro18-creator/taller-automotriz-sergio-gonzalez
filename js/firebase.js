import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCD4Hfuq6jaig2rpWAsGsURkRQwyH_4XH4",
  authDomain: "automotriz-sergio-gonzalez.firebaseapp.com",
  projectId: "automotriz-sergio-gonzalez",
  storageBucket: "automotriz-sergio-gonzalez.firebasestorage.app",
  messagingSenderId: "612851357777",
  appId: "1:612851357777:web:fb593e7442375317df4070"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);