// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY ,
  authDomain: "mern-blog-c8d95.firebaseapp.com",
  projectId: "mern-blog-c8d95",
  storageBucket: "mern-blog-c8d95.appspot.com",
  messagingSenderId: "557352126997",
  appId: "1:557352126997:web:f54a74f3df18ad6ab39c1c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
