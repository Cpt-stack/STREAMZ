import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAzlCZ9d8WFKShfucV69rEU6sVFGjzeEzE",
    authDomain: "streamz-7eacd.firebaseapp.com",
    projectId: "streamz-7eacd",
    storageBucket: "streamz-7eacd.firebasestorage.app",
    messagingSenderId: "544046492679",
    appId: "1:544046492679:web:879ffc055765bfddb80ea2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();