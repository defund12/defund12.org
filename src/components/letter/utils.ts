import { Address } from "./types";

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

export const isTestMode = (): boolean => {
  return window.location.host !== "mail-your-rep.web.app";
};

export const makeAddressLine = (parts: string[]): string | undefined => {
  const partsToUse = parts.filter((p) => Boolean(p));
  if (partsToUse.length > 0) {
    return partsToUse.join(", ");
  } else {
    return undefined;
  }
};
