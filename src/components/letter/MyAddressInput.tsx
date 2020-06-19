// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, ReactElement } from "react";

import { Address } from "./types";

type MyAddressInputProps = {
  /** callback function for every time the address is updated */
  updateAddress: (a: Address) => void;
};

/** Renders input fields for the user's address
 *
 * @return {ReactElement} the rendered component
 */
export default function MyAddressInput({
  updateAddress,
}: MyAddressInputProps): ReactElement {
  const [myAddress, setMyAddress] = useState({} as Address);

  /** Callback for when part of user's address is updated.
   * adds it to the full address in our internal state and
   * calls the parent's callback
   *
   * @param {Address} address the updated address
   */
  function setAddress(address: Partial<Address>) {
    const updatedAddress = { ...myAddress, ...address };
    setMyAddress(updatedAddress);
    updateAddress(updatedAddress);
  }

  return (
    <>
      <fieldset className="pure-form-aligned">
        <div className="pure-control-group">
          <label>Your Name</label>
          <input
            placeholder="Your Name"
            type="text"
            name="name"
            onChange={(e) =>
              setAddress({
                name: e.target.value,
              })
            }
          />
        </div>
      </fieldset>

      <fieldset className="pure-form-aligned">
        <div className="pure-control-group">
          <label>Your Address</label>
          <fieldset className="pure-group pure-form-message-inline">
            <input
              placeholder="123 Main St"
              type="text"
              name="address"
              onChange={(e) =>
                setAddress({
                  address_line1: e.target.value,
                })
              }
            />

            <input
              placeholder="City"
              name="city"
              onChange={(e) =>
                setAddress({
                  address_city: e.target.value,
                })
              }
            />

            <input
              placeholder="State"
              type="text"
              name="state"
              onChange={(e) =>
                setAddress({
                  address_state: e.target.value,
                })
              }
            />

            <input
              placeholder="Zipcode"
              type="text"
              name="zip"
              onChange={(e) =>
                setAddress({
                  address_zip: e.target.value,
                })
              }
            />
          </fieldset>
        </div>
      </fieldset>
    </>
  );
}
