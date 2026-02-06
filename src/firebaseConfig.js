const firebaseConfig = {
  apiKey: "AIzaSyBWA4uAKqe3obPuu2B2iV7aLeXmBwlg4V0",
  authDomain: "quicknotes-450c5.firebaseapp.com",
  projectId: "quicknotes-450c5",
  storageBucket: "quicknotes-450c5.firebasestorage.app",
  messagingSenderId: "805202072549",
  appId: "1:805202072549:web:fd935ed2b879bb2d11550c",
  measurementId: "G-5PP4E8PYG3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
