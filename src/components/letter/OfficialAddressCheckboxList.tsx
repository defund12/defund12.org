import React, { ReactElement } from "react";
import { OfficalAddressCheckbox } from "./OfficialAddressCheckbox";
import { LobAddress } from "./LetterTypes";
import { OfficialAddress } from "../../services/OfficialTypes";

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

  if (myAddress.address_line1 && officialAddresses.length === 0) {
    return <div>No representatives found, sorry</div>;
  }

  return (
    <div className="pure-controls">
      {officialAddresses?.map((officialAddress) => (
        <OfficalAddressCheckbox
          officialAddress={officialAddress}
          onAddressSelected={onAddressSelected}
        />
      ))}
    </div>
  );
}
