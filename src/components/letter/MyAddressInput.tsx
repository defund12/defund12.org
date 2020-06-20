// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, ReactElement } from "react";

import { LobAddress } from "./LetterTypes";

type MyAddressInputProps = {
  /** callback function for every time the address is updated */
  updateAddress: (a: LobAddress) => void;
};

/** Renders input fields for the user's address
 *
 * @return {ReactElement} the rendered component
 */
export default function MyAddressInput({
  updateAddress,
}: MyAddressInputProps): ReactElement {
  const [myAddress, setMyAddress] = useState({} as LobAddress);

  /** Callback for when part of user's address is updated.
   * adds it to the full address in our internal state and
   * calls the parent's callback
   *
   * @param {Address} address the updated address
   */
  function setAddress(address: Partial<LobAddress>) {
    const updatedAddress = { ...myAddress, ...address };
    setMyAddress(updatedAddress);
    updateAddress(updatedAddress);
  }

  return (
    <>
      <fieldset className="pure-form-stacked">
        <div className="pure-control-group">
          <label>Your Name</label>
          <input
            className="pure-u-1"
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

      <fieldset>
        <div className="pure-control-group">
          <label>Your Address</label>

          <input
            className="pure-u-1"
            placeholder="123 Main St"
            type="text"
            name="address"
            onChange={(e) =>
              setAddress({
                address_line1: e.target.value,
              })
            }
          />

          <div className="pure-g">
            <div className="right-pad-input pure-u-1 pure-u-md-1-3">
              <input
                placeholder="City"
                name="city"
                onChange={(e) =>
                  setAddress({
                    address_city: e.target.value,
                  })
                }
              />
            </div>
            <div className="right-pad-input pure-u-1 pure-u-md-1-3">
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
            </div>

            <div className="pure-u-1 pure-u-md-1-3">
              <input
                className="full-width"
                placeholder="Zipcode"
                type="text"
                name="zip"
                onChange={(e) =>
                  setAddress({
                    address_zip: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}
