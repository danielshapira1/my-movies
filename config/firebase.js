// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBZKowm_dEF6d220NCFy2CiqPUqBqA9zo",
  authDomain: "my-movies-bcafc.firebaseapp.com",
  projectId: "my-movies-bcafc",
  storageBucket: "my-movies-bcafc.appspot.com",
  messagingSenderId: "67191366361",
  appId: "1:67191366361:web:1fe963194d6aad68e0d4c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const getAllCollections = async () => {
  try {
    const metadataSnapshot = await getDocs(collection(firestore, "metadata"));
    metadataSnapshot.forEach((doc) => {
      console.log("Collection ID:", doc.id);
    });
  } catch (error) {
    console.log("Error retrieving collections:", error);
  }
};

getAllCollections();


export { auth, onAuthStateChanged,firestore };