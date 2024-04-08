import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCEmcxh_iwPGctxaXAoFCAGWqlyszlJaW4",
  authDomain: "nwitter-reloaded-c96eb.firebaseapp.com",
  projectId: "nwitter-reloaded-c96eb",
  storageBucket: "nwitter-reloaded-c96eb.appspot.com",
  messagingSenderId: "1049082255318",
  appId: "1:1049082255318:web:97d219bdc3cf4e2e12b677",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
