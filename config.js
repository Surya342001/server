const firebase = require("firebase");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCWJzNkyhK5zvDDDCPpFOzkdAgaFfCcOE8",
  authDomain: "temple-58e9b.firebaseapp.com",
  projectId: "temple-58e9b",
  storageBucket: "temple-58e9b.appspot.com",
  messagingSenderId: "513198865295",
  appId: "1:513198865295:web:573674d3f8e7ecfbdae9fa",
  measurementId: "G-6T4R7FF30H",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const User = db.collection("users");
module.exports = { User };
