import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVbERXYxcdBCJlg57ibFg_OEgljohA9Q4",
  authDomain: "chat-app-4a38e.firebaseapp.com",
  databaseURL: "https://chat-app-4a38e-default-rtdb.firebaseio.com",
  projectId: "chat-app-4a38e",
  storageBucket: "chat-app-4a38e.firebasestorage.app",
  messagingSenderId: "452302031683",
  appId: "1:452302031683:web:b799d5192cf62780f6fdf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Realtime Database and get a reference to it
const db = getDatabase(app);

export { db };
