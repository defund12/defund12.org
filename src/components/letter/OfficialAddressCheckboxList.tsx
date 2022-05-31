import React, { ReactElement } from "react";
import { OfficalAddressCheckbox } from "./OfficialAddressCheckbox";
import { LobAddress } from "./LetterTypes";
import { OfficialAddress } from "../../services/OfficialTypes";
import _ from "lodash";

type OfficialAddressCheckboxListProps = {
  /** list of addresses to render, currently not used by callers */
  addresses: OfficialAddress[];
  /** list of official addresses to render from google & blackmad APIs */
  officials: OfficialAddress[];
  /** the user's address, only used for showing a status message based on how filled out it is,
   * could be refactored */
  myAddress: LobAddress;
  /** callback when an address is chekced or unchecked */
  onAddressSelected: (b: boolean, c: LobAddress) => void;
};

/** Renders block of addresses with checkboxes from google & citycouncil API responses
 *
 * @param {OfficialAddressCheckboxListProps} the component props
 * @return {ReactElement} the rendered component
 */
export function OfficialAddressCheckboxList({
  addresses,
  onAddressSelected,
  officials,
  myAddress,
}: OfficialAddressCheckboxListProps): ReactElement {
  const officialAddresses: OfficialAddress[] = [...addresses, ...officials];

  return (
    <>
      {myAddress.address_line1 && officialAddresses.length === 0 ? (
        <>
          <div>No representatives found, sorry</div>
          <br />
        </>
      ) : (
        <div className="pure-controls">
          {officialAddresses?.map((officialAddress) => (
            <OfficalAddressCheckbox
              key={JSON.stringify(officialAddress)}
              officialAddress={officialAddress}
              onAddressSelected={onAddressSelected}
            />
          ))}
        </div>
      )}

      <div hidden={_.isEmpty(officialAddresses) && !myAddress.address_line1}>
        <em>
          This list is populated using the Google Civic Information API. If an
          address is missing, you can use the "Add Missing Representative"
          button below to enter it manually.
          <span>
            &nbsp;
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScA45a5Acnn6hK1R6dd45ttoVbI4tWc7oXl-pjQ-84yx7yuxA/viewform">
              Additionally, consider giving feedback regarding the missing
              information.
            </a>
          </span>
        </em>
      </div>
    </>
  );
}
