import React, { useState } from "react";
import { Address, LETTER_COST } from "./types";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { loadStripe } from "@stripe/stripe-js";
import { isTestMode } from "./utils";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePk = isTestMode()
  ? "pk_test_51GqpRpGLGlm5kFVxzwruVzMZ2Bc07pqosMzyiZd6ixInJHEq6MgFE9v1kRVJZUUhuOT3X2XdfHj31oknZEmKK6KT004CUm09hp"
  : "pk_live_51v9NZmT3TbTBBYultfXFkXO00Ohhh09jN";

const stripePromise = loadStripe(stripePk);

const CheckoutForm = ({
  checkedAddresses,
  myAddress,
  body,
  formValid,
  email,
  variables,
}: {
  checkedAddresses: Address[];
  myAddress: Address;
  body: string;
  formValid: boolean;
  email: string;
  variables: Record<string, string>;
}) => {
  const [error, setError] = useState("");
  const [inSubmit, setInSubmit] = useState(false);

  const totalAmount = checkedAddresses.length * LETTER_COST;

  const handleSubmit = async (event: any) => {
    setInSubmit(true);

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    var response = await fetch(
      "https://us-central1-political-postcards.cloudfunctions.net/api/startPayment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: myAddress,
          toAddresses: checkedAddresses,
          body,
          variables: variables,
          email,
        }),
      }
    ).then(function (response) {
      return response.json();
    });

    if (response.errors) {
      setError(response.errors.map((e: any) => e.message).join(", "));
      return;
    } else {
      setError("");
    }

    const stripeSessionId = response.sessionId;

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeSessionId,
    });
    console.error(error);
  };

  const isDisabled = checkedAddresses.length === 0 || !formValid || inSubmit;

  let buttonText = "";
  if (inSubmit) {
    buttonText = "Submitting ...";
  } else if (myAddress.address_line1 && checkedAddresses.length === 0 && !formValid) {
    buttonText = "Select some addresses and fill in all fields";
  } else if (myAddress.address_line1 && checkedAddresses.length === 0) {
    buttonText = "Select some addresses";
  } else if (!formValid) {
    buttonText = "Please fill in all fields";
  } else {
    buttonText = `Mail ${checkedAddresses.length} letters for $${totalAmount.toFixed(2)}`;
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit} className="text-center">
        <Button variant="primary" type="submit" disabled={isDisabled}>
          {buttonText}
        </Button>
      </form>
    </>
  );
};

export default CheckoutForm;
