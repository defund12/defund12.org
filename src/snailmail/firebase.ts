import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiQLnfziASZ6GGByNDLV3E7WkhtOtfi9s",
  authDomain: "political-postcards.firebaseapp.com",
  databaseURL: "https://political-postcards.firebaseio.com",
  projectId: "political-postcards",
  storageBucket: "political-postcards.appspot.com",
  messagingSenderId: "308810265041",
  appId: "1:308810265041:web:2959c1e11ae6967c7370f0",
  measurementId: "G-9Y0THVSV61",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

export const templatesCollection = db.collection("templates")