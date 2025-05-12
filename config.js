import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCVbERXYxcdBCJlg57ibFg_OEgljohA9Q4",
//   authDomain: "chat-app-4a38e.firebaseapp.com",
//   databaseURL: "https://chat-app-4a38e-default-rtdb.firebaseio.com",
//   projectId: "chat-app-4a38e",
//   storageBucket: "chat-app-4a38e.firebasestorage.app",
//   messagingSenderId: "452302031683",
//   appId: "1:452302031683:web:b799d5192cf62780f6fdf6"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDVB4jle0L4TSOAsA7FpVU-WOxv4GToCLw",
  authDomain: "chat-application-645d9.firebaseapp.com",
  projectId: "chat-application-645d9",
  storageBucket: "chat-application-645d9.firebasestorage.app",
  messagingSenderId: "450958788642",
  appId: "1:450958788642:web:ac22fbe4d5cf7aaf99627b",
  measurementId: "G-TG4882HTX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Realtime Database and get a reference to it
const db = getDatabase(app);

export { db };
