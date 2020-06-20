/* eslint-disable @typescript-eslint/no-var-requires */
import functions = require('firebase-functions');

export const TestConfig = functions.config().test;
export const ProdConfig = functions.config().prod;

export const ProdLob = require("lob")(ProdConfig.lob.api_key);
export const TestLob = require("lob")(TestConfig.lob.api_key);

export const prodStripe = require("stripe")(ProdConfig.stripe.api_key);
export const testStripe = require("stripe")(TestConfig.stripe.api_key);

// import mailgun = require("mailgun-js");
// const DOMAIN = "sandboxde73a2919f44487791325367101f5da8.mailgun.org";
// export const testMailgun = mailgun({apiKey: Config.mailgun.api_key, domain: DOMAIN});

export const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(ProdConfig.sendgrid.api_key);

export const GoogleApiKey = ProdConfig.google.api_key;