/* eslint-disable camelcase */

export interface GoogleCivicRepsAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
}

export interface GoogleCivicRepsResponseOfficial {
  name: string;
  address: GoogleCivicRepsAddress[];
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

export interface OfficialAddressParams {
  levels: GoogleCivicRepsResponseLevel[];
  roles: GoogleCivicRepsResponseRole[];
  address: GoogleCivicRepsAddress;
  link?: string;
  officeName: string;
  name: string;
  email?: string;
}

/**
 * A unfied wrapper around officials that combines google & blackmad responses
 */
export class OfficialAddress implements LevelsAndRoles {
  officeName?: string;
  address: GoogleCivicRepsAddress;
  link?: string;
  levels: GoogleCivicRepsResponseLevel[];
  roles: GoogleCivicRepsResponseRole[];
  name: string;
  email?: string;

  // eslint-disable-next-line require-jsdoc
  constructor({
    levels,
    roles,
    address,
    link,
    officeName,
    name,
    email,
  }: OfficialAddressParams) {
    this.officeName = officeName;
    this.address = address;
    this.link = link;
    this.roles = roles;
    this.levels = levels;
    this.name = name;
    this.email = email;
  }
}
