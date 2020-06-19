import * as _ from "lodash";

import {
  AbstractRepresentativeFetchingService,
  FetchOfficialsParams,
} from "./AbstractRepresentativeFetchingService";
import { OfficialAddress, LevelsAndRoles } from "./OfficialTypes";
import { GoogleCivicInformationApiService } from "./GoogleCivicInformationApiService";
import { BlackmadCityCouncilApi } from "./BlackmadCityCouncilService";

/** Is this offical a city council person
 *
 * @param {LevelsAndRoles} official offical to check
 * @return {boolean} is this offical a city council person
 */
function isCityCouncilOffical(official: LevelsAndRoles) {
  return (
    official.roles?.includes("legislatorUpperBody") &&
    official.levels?.includes("locality")
  );
}

/** fetches representative information from Google Civic Information Api */
export class CombinedOfficialFetchingService
  implements AbstractRepresentativeFetchingService {
  /** constructor
   * @param {string} googleApiKey a google api key with civic info api perms
   */
  constructor(public googleApiKey: string) {}

  /** fetch officials from google & blackmad APIs based on user address
   *
   * @param {FetchOfficialsParams} params input params
   * @return {Promise<OfficialAddress[]>} A list of officials and their addresses
   */
  async fetch(params: FetchOfficialsParams): Promise<OfficialAddress[]> {
    const googleApi = new GoogleCivicInformationApiService(this.googleApiKey);
    const blackmadApi = new BlackmadCityCouncilApi();

    const { restricts } = params;
    const cityCouncilOnly =
      restricts?.length === 1 &&
      restricts?.[0]?.level === "locality" &&
      restricts?.[0]?.role === "legislatorUpperBody";

    // Make two calls
    // One to google, which has perfect information as far as I can tell for mayorial level and up everywhere
    // Second to blackmad's city council API which tries to fill holes in major cities where google's city council coverage is lacking (SF, NYC)
    let googlePromise: Promise<OfficialAddress[]> = Promise.resolve([]);
    if (!cityCouncilOnly) {
      googlePromise = googleApi.fetch(params);
    }

    const blackmadPromise = blackmadApi.fetch(params);

    const googleResponse = await googlePromise;
    const blackmadResponse = await blackmadPromise;

    // combine google response and blackmad API response
    // If we got a response from blackmad, which for now is all city councils
    // filter out city councils from google so we don't have dupes.
    let officials = blackmadResponse;

    const blackmadHasCityCouncilMembers = _.some(
      blackmadResponse,
      isCityCouncilOffical
    );

    if (blackmadHasCityCouncilMembers) {
      officials = [
        ...officials,
        ...googleResponse.filter((a) => !isCityCouncilOffical(a)),
      ];
    } else {
      officials = [...officials, ...googleResponse];
    }
    return officials;
  }
}
