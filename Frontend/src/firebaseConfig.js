// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA8pSPC13DH0QNfk1vqtC-ifiID3KE9_o",
  authDomain: "mentor-mentee-management-36683.firebaseapp.com",
  projectId: "mentor-mentee-management-36683",
  storageBucket: "mentor-mentee-management-36683.firebasestorage.app",
  messagingSenderId: "593526749259",
  appId: "1:593526749259:web:d6f8741adf4759f43df5ce",
  measurementId: "G-DS1E0KMWP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;