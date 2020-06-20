import { markOrderPaid } from "../orders";

import * as asyncHandler from "express-async-handler";

const StripPaymentWebhook = asyncHandler(async (req, res) => {
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await markOrderPaid(event.data.object.client_reference_id);
      return res.json({ received: true });
    default:
      // Unexpected event type
      return res.status(400).end();
  }
});

export default StripPaymentWebhook;
