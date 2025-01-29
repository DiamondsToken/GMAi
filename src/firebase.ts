// src/firebase/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Incolla la tua configurazione qui
const firebaseConfig = {
  apiKey: 'AIzaSyBSkNFTLh_rlINM9CEqTedS_EcRY2EtbX8',
  authDomain: 'gmai-e1b16.firebaseapp.com',
  projectId: 'gmai-e1b16',
  storageBucket: 'gmai-e1b16.firebasestorage.app',
  messagingSenderId: '355774464075',
  appId: '1:355774464075:web:2ac3a055c65c8a8eaacdce',
  measurementId: 'G-L4LK2CK8X8',
};

const app = initializeApp(firebaseConfig);

// Ottieni istanza di autenticazione
export const auth = getAuth(app);
