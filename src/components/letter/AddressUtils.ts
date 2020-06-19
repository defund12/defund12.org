import { Address } from "./LetterTypes";

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

/** Formats a structured address to a single line, suitable for geocoding or display
 *
 * @param {Address} address
 * @return {string} address formatted as single line
 */
export const addressToSingleLine = (address: Address): string => {
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
};
