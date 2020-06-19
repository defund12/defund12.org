import { LobAddress } from "./LetterTypes";
import { OfficialAddress } from "../../services/OfficialTypes";

/** Joins parts with commas, filtering out undefineds and empties
 *
 * @param {string[]} parts strings to concatenate
 * @return {string} comma joined version of parts
 */
export const makeAddressLine = (parts: string[]): string | undefined => {
  const partsToUse = parts.filter((p) => Boolean(p));
  if (partsToUse.length > 0) {
    return partsToUse.join(", ");
  } else {
    return undefined;
  }
};

/** convert OfficialAddress to LobAddress (our letter sending API)
 * @param {OfficialAddress} officialAddress the address to convert
 * @return {LobAddress} the converted address
 */
export function officialAddressToLobAddress(
  officialAddress: OfficialAddress
): LobAddress {
  return {
    name: officialAddress.name,
    address_line1: officialAddress.address.line1,
    address_line2: makeAddressLine([
      officialAddress.address.line2,
      officialAddress.address.line3,
    ]),
    address_city: officialAddress.address.city,
    address_state: officialAddress.address.state,
    address_zip: officialAddress.address.zip,
    address_country: "US",
  };
}

/** Formats a structured address to a single line, suitable for geocoding or display
 *
 * @param {OfficialAddress} officialAddress
 * @return {string} address formatted as single line
 */
export const officialAddressToSingleLine = (
  officialAddress: OfficialAddress
): string => {
  return lobAddressToSingleLine(officialAddressToLobAddress(officialAddress));
};

/** Formats a structured address to a single line, suitable for geocoding or display
 *
 * @param {Address} address
 * @return {string} address formatted as single line
 */
export function lobAddressToSingleLine(address: LobAddress): string {
  const cityStateLine = [
    address.address_city,
    address.address_state,
    address.address_zip,
  ]
    .filter((a) => Boolean(a))
    .join(" ");
  const formattedAddress = [
    address.address_line1,
    address.address_line2,
    cityStateLine,
  ]
    .filter((l) => Boolean(l) && l !== "" && l !== " ")
    .join(", ");
  return formattedAddress;
}
