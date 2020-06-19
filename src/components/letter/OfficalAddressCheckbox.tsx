import React, { ReactElement } from "react";
import { OfficialAddress, Address } from "./types";
import { addressToSingleLine } from "./utils";

// eslint-disable-next-line valid-jsdoc
/** Renders an OfficialAddress with a checkbox */
export function OfficalAddressCheckbox({
  officialAddress,
  onAddressSelected,
}: {
  officialAddress: OfficialAddress;
  onAddressSelected: (checked: boolean, address: Address) => void;
}): ReactElement {
  const address = officialAddress.address;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAddressSelected(event.target.checked, address);
  };
  const key = `${address.name}:${officialAddress.officeName}`;
  return (
    <label className="pure-checkbox" key={key}>
      <input type="checkbox" onChange={onChange} />
      <>
        <b>{address.name}</b>
        {officialAddress.officeName && ` (${officialAddress.officeName})`},{" "}
        {addressToSingleLine(address)}{" "}
        {officialAddress.link && (
          <a target="_blank" href={officialAddress.link}>
            Read about their positions
          </a>
        )}
      </>
    </label>
  );
}
