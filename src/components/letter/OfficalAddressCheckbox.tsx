import React, { ReactElement } from "react";
import { OfficialAddress, Address } from "./types";
import { addressToSingleLine } from "./utils";

type OfficialAddressCheckboxProps = {
  /** the address to render */
  officialAddress: OfficialAddress;
  /** callback for when the checkbox is checked or unchecked */
  onAddressSelected: (checked: boolean, address: Address) => void;
};

/** Renders an OfficialAddress with a checkbox
 *
 * @param {OfficialAddressCheckboxProps} the component props
 * @return {ReactElement} the rendered component
 */
export function OfficalAddressCheckbox({
  officialAddress,
  onAddressSelected,
}: OfficialAddressCheckboxProps): ReactElement {
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
