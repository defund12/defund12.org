import admin = require("firebase-admin");
admin.initializeApp();
export const templateCollection = admin.firestore().collection("templates")
export const orderCollection = admin.firestore().collection("orders")