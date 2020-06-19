import React, { ReactElement } from "react";
import { Address, OfficialAddress, OfficialRestrict } from "./types";
import { OfficalAddressCheckbox } from "./OfficalAddressCheckbox";

/** Renders block of addresses with checkboxes from google & citycouncil API responses
 *
 * @return {React.ReactNode} the rendered component
 */
export function OfficialAddressCheckboxList({
  addresses,
  onAddressSelected,
  officials,
  myAddress,
}: {
  addresses: Address[];
  officials: OfficialAddress[];
  onAddressSelected: (b: boolean, c: Address) => void;
  restricts?: OfficialRestrict[];
  myAddress: Address;
}): ReactElement {
  const officialAddresses: OfficialAddress[] =
    (addresses || []).length > 0
      ? addresses.map((address) => {
          return { address, levels: [], roles: [] };
        })
      : officials;

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
