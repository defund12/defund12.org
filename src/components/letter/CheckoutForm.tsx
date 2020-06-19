// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, ReactElement } from "react";
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

type CheckoutFormProps = {
  /** a list of addresses the user has selected to send letters to */
  checkedAddresses: Address[];
  /** the user's address (the return address for the letter) */
  myAddress: Address;
  /** the body of the letter with all variables substituted */
  body: string;
  /** has the user filled out all the fields? */
  formValid: boolean;
  /** the user's email - for sending them a send confirmation letter */
  email: string;
};

/** The part of the Letter flow that is responsible for the checkout button
 *
 * @param {CheckoutFormProps} props the component props
 * @return {ReactElement} the checkout form
 */
export function CheckoutForm({
  checkedAddresses,
  myAddress,
  body,
  formValid,
  email,
}: CheckoutFormProps): ReactElement {
  const [error, setError] = useState("");
  const [inSubmit, setInSubmit] = useState(false);

  /** Handles checkout submit click
   *
   * @param {React.SyntheticEvent} event the click even
   */
  async function handleSubmit(event: React.SyntheticEvent) {
    setInSubmit(true);

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const response = await fetch(
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
          email,
          test: isTestMode(),
        }),
      }
    ).then((response) => {
      return response.json();
    });

    if (response.errors) {
      setError(
        response.errors.map((e: { message: string }) => e.message).join(", ")
      );
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
  }

  /** Generates the text in the checkout button to reflect what the user needs to do to get it enabled
   * or what the total cost is
   *
   * @return {string} the text of the checkout button
   */
  function makeButtonText() {
    const totalAmount = checkedAddresses.length * LETTER_COST;

    if (inSubmit) {
      return "Submitting ...";
    } else if (
      myAddress.address_line1 &&
      checkedAddresses.length === 0 &&
      !formValid
    ) {
      return "Select some addresses and fill in all fields";
    } else if (myAddress.address_line1 && checkedAddresses.length === 0) {
      return "Select some addresses";
    } else if (!formValid) {
      return "Please fill in all fields";
    } else {
      return `Mail ${
        checkedAddresses.length
      } letters for $${totalAmount.toFixed(2)}`;
    }
  }

  const isDisabled = checkedAddresses.length === 0 || !formValid || inSubmit;

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit} className="text-center">
        <Button variant="primary" type="submit" disabled={isDisabled}>
          {makeButtonText()}
        </Button>
      </form>
    </>
  );
}

export default CheckoutForm;
