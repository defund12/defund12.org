import * as asyncHandler from "express-async-handler";

import { startPaymentRequestSchema, StartPaymentRequestType } from "../types";
import { orderCollection } from "../database";
import { testStripe, prodStripe, TestConfig, ProdConfig } from "../apis";

const StartPayment = asyncHandler(async (req, res) => {
  const host = req.get("Origin") || req.get("origin");

  const validation = startPaymentRequestSchema.validate(req.body);
  if (validation.error) {
    res.status(500).json({ errors: validation.error.details });
    return;
  }

  const body = req.body as StartPaymentRequestType;

  const isTest = body.test;

  const toAddresses = body.toAddresses;

  const orderRef = orderCollection.doc();
  const orderId = orderRef.id;

  const stripe = isTest ? testStripe : prodStripe;
  const productId = isTest
    ? TestConfig.stripe.product_id
    : ProdConfig.stripe.product_id;

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: productId,
        quantity: (toAddresses || []).length,
      },
    ],
    customer_email: body.email,
    client_reference_id: orderId,
    mode: "payment",
    success_url: `${host}/letterSuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${host}/cancel`,
  });

  orderRef.set({ ...body, orderId, isTest: isTest || false }).then(() => {
    res.json({ sessionId: stripeSession.id });
  });
});

export default StartPayment;
