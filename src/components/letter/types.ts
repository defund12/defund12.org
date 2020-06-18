/* eslint-disable camelcase */
export const POSTCARD_COST = 0.7;
export const LETTER_COST = 1.0;

export interface Address {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
}

export interface OfficialRestrict {
  level: GoogleCivicRepsResponseLevel;
  role: GoogleCivicRepsResponseRole;
}

export interface Template {
  template: string;
  addresses?: Address[];
  name?: string;
  id?: string;
  notes?: string;
  officialRestricts?: OfficialRestrict[];
  cityCouncilOnly?: boolean;
}

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

export interface GoogleCivicRepsResponseOffice {
  name: string;
  divisionId: string;
  levels: GoogleCivicRepsResponseLevel[];
  roles: GoogleCivicRepsResponseRole[];
  officialIndices: number[];
}

export interface GoogleCivicRepsResponse {
  officials: GoogleCivicRepsResponseOfficial[];
  offices: GoogleCivicRepsResponseOffice[];
}

export interface BlackmadCityCountilResponseOfficial {
  addresses: {
    address: BasicAddress;
    fax: string;
    name: string;
    phone: string;
  }[];
  district: string;
  email: string;
  name: string;
  office: {
    level: GoogleCivicRepsResponseLevel;
    name: string;
    role: GoogleCivicRepsResponseRole;
  };
  body: string;
  photoUrl: string;
  urls: string[];
}

export interface BlackmadCityCountilResponse {
  data: BlackmadCityCountilResponseOfficial[];
}

export type OfficialAddress = {
  officeName?: string;
  address: Address;
  link?: string;
};
