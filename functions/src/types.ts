import Joi = require("@hapi/joi");

import "joi-extract-type";

export const addressSchema = Joi.object({
  name: Joi.string().required(),
  address_line1: Joi.string().required(),
  address_line2: Joi.string().optional(),
  address_city: Joi.string().required(),
  address_state: Joi.string().required(),
  address_zip: Joi.string().required(),
  address_country: Joi.string().default('US'),
  email: Joi.string().email(),
});

export type Address = Joi.extractType<typeof addressSchema>;

export const startPaymentRequestSchema = Joi.object({
  fromAddress: addressSchema.required(),
  toAddresses: Joi.array().items(addressSchema).min(1),
  body: Joi.string().required(),
  email: Joi.string().email().required(),
  test: Joi.bool().default(false),
});

export type Order = Joi.extractType<typeof startPaymentRequestSchema> & {
  orderId: string;
  isTest: boolean;
}
export type StartPaymentRequestType = Joi.extractType<typeof startPaymentRequestSchema>;