import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import app from "./app";
import { executeOrder } from "./orders";
import { Order } from "./types";

exports.api = functions.https.onRequest(app);

exports.executeOrder = functions.firestore
  .document("orders/{orderId}")
  .onUpdate((change) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    if (
      previousValue.paid ||
      !newValue.paid ||
      newValue.fulfilled ||
      previousValue.fulfilled
    ) {
      return true;
    }

    return executeOrder(newValue as Order);
  });
