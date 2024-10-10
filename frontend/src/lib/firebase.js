import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseCredentials } from "../constants/credentials";

const firebaseConfig = {
  apiKey: firebaseCredentials.apiKey,

  authDomain: firebaseCredentials.authDomain,

  projectId: firebaseCredentials.projectId,

  storageBucket: firebaseCredentials.storageBucket,

  messagingSenderId: firebaseCredentials.messagingSenderId,

  appId: firebaseCredentials.appId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const chatDb = "chats";
export const chatListDb = "chatList";
export const chatMessagesCollection = "messages";