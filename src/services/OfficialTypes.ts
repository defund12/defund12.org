/* eslint-disable camelcase */

export interface BasicAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
}

export interface GoogleCivicRepsResponseOfficial {
  name: string;
  address: BasicAddress[];
  urls?: string[];
  phones?: string[];
  emails?: string[];
  party?: string;
}

export type GoogleCivicRepsResponseLevel =
  | "international"
  | "country"
  | "administrativeArea1"
  | "regional"
  | "administrativeArea2"
  | "locality"
  | "subLocality1"
  | "subLocality2"
  | "special";

export type GoogleCivicRepsResponseRole =
  | "headOfState"
  | "headOfGovernment"
  | "deputyHeadOfGovernment"
  | "governmentOfficer"
  | "executiveCouncil"
  | "legislatorUpperBody"
  | "legislatorLowerBody"
  | "highestCourtJudge"
  | "judge"
  | "schoolBoard"
  | "specialPurposeOfficer";

export interface GoogleCivicRepsResponseOffice extends LevelsAndRoles {
  name: string;
  divisionId: string;
  officialIndices: number[];
}

export interface LevelsAndRoles {
  levels: GoogleCivicRepsResponseLevel[];
  roles: GoogleCivicRepsResponseRole[];
}

export interface OfficialRestrict {
  level: GoogleCivicRepsResponseLevel;
  role: GoogleCivicRepsResponseRole;
}

export interface Address {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
}

export interface OfficialAddress extends LevelsAndRoles {
  officeName?: string;
  address: Address;
  link?: string;
}
