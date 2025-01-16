import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here

const firebaseConfig = {
  apiKey: "AIzaSyCt-D7Is7MrHoDrnz4fOvbE2sZXfJH4dAU",
  authDomain: "summative-2f427.firebaseapp.com",
  projectId: "summative-2f427",
  storageBucket: "summative-2f427.firebasestorage.app",
  messagingSenderId: "298840091428",
  appId: "1:298840091428:web:a06654f79fa48f03eba1b1"
};

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };