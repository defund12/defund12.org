import React, { ReactElement } from "react";
import { OfficialAddress } from "../../services/OfficialTypes";
import { officialAddressToSingleLine } from "./AddressUtils";

type OfficialAddressCheckboxProps = {
  /** the address to render */
  officialAddress: OfficialAddress;
  /** callback for when the checkbox is checked or unchecked */
  onAddressSelected: (checked: boolean, address: OfficialAddress) => void;
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
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAddressSelected(event.target.checked, officialAddress);
  };

  const key = `${officialAddress.name}:${officialAddress.officeName}`;
  return (
    <label className="pure-checkbox" key={key}>
      <input type="checkbox" onChange={onChange} />
      <>
        <b>{officialAddress.name}</b>
        {officialAddress.officeName && ` (${officialAddress.officeName})`},{" "}
        {officialAddressToSingleLine(officialAddress)}{" "}
        {officialAddress.link && (
          <a target="_blank" href={officialAddress.link}>
            Read about their positions
          </a>
        )}
      </>
    </label>
  );
}
