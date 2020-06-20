import { notifyUserAboutAlmostDelivered } from "./emails";

import * as asyncHandler from "express-async-handler";

const lobWebhook = asyncHandler(async (req, res) => {
  await notifyUserAboutAlmostDelivered(req.body);
  return res.json({});
});

export default lobWebhook;
