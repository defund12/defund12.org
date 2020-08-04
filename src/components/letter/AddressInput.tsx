// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, ReactElement } from "react";

import { LobAddress } from "./LetterTypes";

type AddressInputProps = {
  /** callback function for every time the address is updated */
  onAddressUpdated: (a: LobAddress) => void;
};

/** Renders input fields for the user's address
 *
 * @return {ReactElement} the rendered component
 */
export default function AddressInput({
  onAddressUpdated: onAddressUpdated,
}: AddressInputProps): ReactElement {
  const [address, setAddress] = useState({} as LobAddress);

  /** Callback for when part of user's address is updated.
   * adds it to the full address in our internal state and
   * calls the parent's callback
   *
   * @param {Address} addressPatch the updated address
   */
  function updateAddress(addressPatch: Partial<LobAddress>) {
    const updatedAddress = { ...address, ...addressPatch };
    setAddress(updatedAddress);
    onAddressUpdated(updatedAddress);
  }

  return (
    <>
      <fieldset className="pure-form-stacked">
        <div className="pure-control-group">
          <label>Name</label>
          <input
            className="pure-u-1"
            placeholder="Name"
            type="text"
            name="name"
            onChange={(e) =>
              updateAddress({
                name: e.target.value,
              })
            }
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="pure-control-group">
          <label>Address</label>

          <input
            className="pure-u-1"
            placeholder="123 Main St"
            type="text"
            name="address"
            onChange={(e) =>
              updateAddress({
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
                  updateAddress({
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
                  updateAddress({
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
                  updateAddress({
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
