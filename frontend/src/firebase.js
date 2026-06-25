import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyA9jZKFBiMVdMPMQgbeEHgSLe57r1nle8c",
  authDomain: "ma-cart-78a0f.firebaseapp.com",
  projectId: "ma-cart-78a0f",
  storageBucket: "ma-cart-78a0f.firebasestorage.app",
  messagingSenderId: "405307083817",
  appId: "1:405307083817:web:063abdaf61d4b34f0b2038",
  measurementId: "G-66BNMYYGBZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };