import * as express from "express";

import cors = require("cors");
import bodyParser = require("body-parser");

import LobWebhookHandler from "./handlers/LobWebhook";
import StripPaymentWebhookHandler from "./handlers/StripPaymentWebhook";
import StartPaymentHandler from "./handlers/LobWebhook";

const app = express();

// allow json requests from anywhere for ease of use
// these are hosted on cloudfunctions.net but our frontend is on defund12.org
app.use(cors({ origin: true }));

// automatically parse json POST bodies
app.use(bodyParser.json());

// Called from the frontend to start the stripe->webhook->lob flow
// Saves the order in the database and redirects to stripe checkout flow
app.post("/startPayment", StartPaymentHandler);

// Callback from stripe when a payment is successful
// This kicks off actually sending the order to lob
app.post("/paymentWebhook", StripPaymentWebhookHandler);

// called by Lob.com on various events in the lifecycle of sending
// a letter. On our plan, we only get one event, so we use the
// "almost delivered" event.
app.post("/lob/webhook", LobWebhookHandler);

export default app;
