import {
  FetchOfficialsParams,
  AbstractRepresentativeFetchingService,
  shouldUseOfficial,
} from "./AbstractRepresentativeFetchingService";
import {
  OfficialAddress,
  OfficialRestrict,
  GoogleCivicRepsAddress,
  GoogleCivicRepsResponseLevel,
  GoogleCivicRepsResponseRole,
} from "./OfficialTypes";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import _ from "lodash";

export interface BlackmadCityCouncilResponseOfficial {
  addresses: {
    address: GoogleCivicRepsAddress;
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

export interface BlackmadCityCouncilResponse {
  data: BlackmadCityCouncilResponseOfficial[];
}

/** convert an entry from blackmad's city council api into unifed OfficialAddress structure
 *
 * officials sometimes have multiple offices, like in their home district and in the capital / near city hall etc
 *
 * @param {BlackmadCityCouncilResponseOfficial} cityCouncilMember the entry to convert
 * @return {OfficialAddress[]} one or more addresses representing that cityCouncilMember
 */
function blackmadCityCouncilEntryToOfficialAddresses(
  cityCouncilMember: BlackmadCityCouncilResponseOfficial
): OfficialAddress[] {
  let link: string;
  if (cityCouncilMember.body === "New York City Council") {
    link = `https://defund-nypd-reps.glitch.me/district/${cityCouncilMember.district}`;
  } else {
    link = cityCouncilMember.urls?.[0];
  }

  return cityCouncilMember.addresses.map((address) => {
    const officeName = address.name
      ? cityCouncilMember.office.name + " - " + address.name
      : cityCouncilMember.office.name;
    return new OfficialAddress({
      name: cityCouncilMember.name,
      address: address.address,
      officeName,
      link,
      levels: [cityCouncilMember.office.level],
      roles: [cityCouncilMember.office.role],
      email: cityCouncilMember.email,
    });
  });
}

/** convert an entire response from blackmad's city council API to OfficialAddresses
 *
 * @param {BlackmadCityCouncilResponse} cityCouncilMembers the API response to convert
 * @param {OfficialRestrict[]} restricts restrictions on what levels/roles of official to return
 * @return {OfficialAddress[]} one or more addresses extracted from the response
 */
function blackmadCityCouncilResponseToOfficialAddresses(
  cityCouncilMembers: BlackmadCityCouncilResponse,
  restricts?: OfficialRestrict[]
): OfficialAddress[] {
  if (!cityCouncilMembers?.data) {
    return [];
  }

  const filteredMembers = cityCouncilMembers.data.filter((cityCouncilMember) =>
    shouldUseOfficial({
      restricts,
      levels: [cityCouncilMember.office.level],
      roles: [cityCouncilMember.office.role],
    })
  );

  return _.flatMap(filteredMembers, (cityCouncilMember) => {
    return blackmadCityCouncilEntryToOfficialAddresses(cityCouncilMember);
  });
}

/** fetches representative information from blackmad's City Council Api */
export class BlackmadCityCouncilApi
  implements AbstractRepresentativeFetchingService {
  /** fetch officials from blackmad's city council API
   *
   * @param {BaseOfficialApiParams} input params
   * @return {Promise<OfficialAddress[]>} addresses of officials corresponding to address, filtered by restricts
   */
  async fetch({
    address,
    restricts,
  }: FetchOfficialsParams): Promise<OfficialAddress[]> {
    const latLng = await getGeocode({ address }).then((results) =>
      getLatLng(results[0])
    );

    const { lat, lng } = latLng;

    const res = await fetch(
      `https://city-council-api.herokuapp.com/lookup?lat=${lat}&lng=${lng}`
    );

    const json = (await res.json()) as BlackmadCityCouncilResponse;

    return blackmadCityCouncilResponseToOfficialAddresses(json, restricts);
  }
}
