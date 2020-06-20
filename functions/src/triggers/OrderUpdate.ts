import { executeOrder } from "./orders";
import { Order } from "../types";

import * as functions from "firebase-functions";

const orderUpdateTrigger = functions.firestore
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

export default orderUpdateTrigger;
