import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCAS0yNXUeHcbsJ2dnffDB0eib_R_FOS40",
    authDomain: "seafood-inventory-75acf.firebaseapp.com",
    projectId: "seafood-inventory-75acf",
    storageBucket: "seafood-inventory-75acf.appspot.com",
    messagingSenderId: "149907759059",
    appId: "1:149907759059:web:8c1a67bea018ddbed79926",
    measurementId: "G-D4DGETCGQG"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db }