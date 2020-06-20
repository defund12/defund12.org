import {
  FetchOfficialsParams,
  AbstractRepresentativeFetchingService,
  shouldUseOfficial,
} from "./AbstractRepresentativeFetchingService";
import {
  OfficialAddress,
  GoogleCivicRepsResponseOfficial,
  GoogleCivicRepsResponseOffice,
  OfficialRestrict,
} from "./OfficialTypes";
import _ from "lodash";

export interface GoogleCivicRepsResponse {
  officials: GoogleCivicRepsResponseOfficial[];
  offices: GoogleCivicRepsResponseOffice[];
}

/** convert one official from google's civic info API to OfficialAddresses
 *
 * @param {GoogleCivicRepsResponseOffice} office the office of the official
 * @param {GoogleCivicRepsResponseOfficial} official the official
 * @return {OfficialAddress[]} one or more addresses extracted from the response
 */
function googleCivicRepsOfficialToOfficialAddresses(
  office: GoogleCivicRepsResponseOffice,
  official: GoogleCivicRepsResponseOfficial
): OfficialAddress[] {
  // unused for now
  // divisionId: "ocd-division/country:us/state:pa/place:philadelphia/council_district:1",
  // const districtPattern = /:(\d+)$/;
  // let district: string | undefined;
  // if (districtPattern.test(office.divisionId)) {
  //   district = office.divisionId.match(districtPattern)?.[1];
  // }

  return (official.address || []).map((address) => {
    return new OfficialAddress({
      name: official.name,
      address: address,
      officeName: office.name,
      levels: office.levels,
      roles: office.roles,
      link: official.urls?.[0],
      email: official.emails?.[0],
    });
  });
}

/** convert an entire response from google's civic info API to OfficialAddresses
 *
 * @param {GoogleCivicRepsResponse} reps the API response to convert
 * @param {OfficialRestrict[]} restricts restrictions on what levels/roles of official to return
 * @return {OfficialAddress[]} one or more addresses extracted from the response
 */
function googleCivicRepsResponseToOfficialAddresses(
  reps: GoogleCivicRepsResponse,
  restricts?: OfficialRestrict[]
): OfficialAddress[] {
  if (!reps.offices) {
    return [];
  }

  // Google does a bad job with their own schema, often they are missing "roles"
  // So try to infer them
  reps.offices.forEach((office) => {
    if (
      !office.roles &&
      office.levels.includes("locality") &&
      office.name.includes("Council")
    ) {
      office.roles = ["legislatorUpperBody"];
    }

    if (
      !office.roles &&
      office.levels.includes("locality") &&
      office.name.includes("Mayor")
    ) {
      office.roles = ["headOfState"];
    }
  });

  // Filter out judges and VP/pres and obey other restrictions
  const offices = reps.offices.filter((office) => {
    const isPresidenty =
      office.levels.includes("country") &&
      (office.roles.includes("headOfState") ||
        office.roles.includes("headOfGovernment") ||
        office.roles.includes("deputyHeadOfGovernment"));

    const isJudgy =
      office.roles?.includes("highestCourtJudge") ||
      office.roles?.includes("judge") ||
      office.name.includes("Justice") ||
      office.name.includes("Judge");

    const shouldUse = shouldUseOfficial({
      restricts,
      ...office,
    });
    return !isPresidenty && !isJudgy && shouldUse;
  });

  return _.flatMap(offices, (office) => {
    return _.flatMap(office.officialIndices, (officialIndex) => {
      const official = reps.officials[officialIndex];
      return googleCivicRepsOfficialToOfficialAddresses(office, official);
    }).filter((a) => a !== undefined) as OfficialAddress[];
  });
}

/** fetches representative information from Google Civic Information Api */
export class GoogleCivicInformationApiService
  implements AbstractRepresentativeFetchingService {
  /** constructor
   * @param {string} googleApiKey a google api key with civic info api perms
   */
  constructor(public googleApiKey: string) {}

  /** fetch officials from google civic info API
   * @param {FetchOfficialsParams} input params
   * @return {Promise<OfficialAddress[]>} addresses of officials corresponding to address, filtered by restricts
   */
  async fetch({
    address,
    restricts,
  }: FetchOfficialsParams): Promise<OfficialAddress[]> {
    const params = new URLSearchParams({
      address,
      key: this.googleApiKey,
    }).toString();

    const res = await fetch(
      "https://www.googleapis.com/civicinfo/v2/representatives?" + params
    );
    const json = await res.json();

    return googleCivicRepsResponseToOfficialAddresses(
      json as GoogleCivicRepsResponse,
      restricts
    );
  }
}
