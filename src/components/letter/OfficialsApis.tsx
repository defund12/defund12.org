import { makeAddressLine } from "./AddressUtils";
import {
  BlackmadCityCouncilResponse,
  OfficialRestrict,
  GoogleCivicRepsResponse,
  OfficialAddress,
  LevelsAndRoles,
  BlackmadCityCouncilResponseOfficial,
  GoogleCivicRepsResponseOffice,
  GoogleCivicRepsResponseOfficial,
} from "./LetterTypes";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import _ from "lodash";

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
    return {
      address: {
        name: cityCouncilMember.name,
        address_line1: address.address.line1,
        address_line2: makeAddressLine([
          address.address.line2,
          address.address.line3,
        ]),
        address_city: address.address.city,
        address_state: address.address.state,
        address_zip: address.address.zip,
        address_country: "US",
      },
      officeName,
      link,
      levels: [cityCouncilMember.office.level],
      roles: [cityCouncilMember.office.role],
    };
  });
}

type ShouldUseOfficialParams = {
  /** restricts restricts to obey */
  restricts?: OfficialRestrict[];
} & LevelsAndRoles;

/** Whether or not an official should be included based on resticts
 *
 * @param {ShouldUseOfficialParams} restricts, roles and levels
 * @return {boolean} should use
 */
function shouldUseOfficial({
  restricts,
  levels,
  roles,
}: ShouldUseOfficialParams): boolean {
  // if restricts is empty let everything through
  if (!restricts) {
    return true;
  }

  return _.some(
    restricts || [],
    (restrict) =>
      (levels || []).includes(restrict.level) &&
      ((restrict.role as string) === "*" ||
        (roles || []).includes(restrict.role))
  );
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
  // divisionId: "ocd-division/country:us/state:pa/place:philadelphia/council_district:1",
  const districtPattern = /:(\d+)$/;
  let district: string | undefined;
  if (districtPattern.test(office.divisionId)) {
    district = office.divisionId.match(districtPattern)?.[1];
  }

  return (official.address || []).map((address) => {
    return {
      address: {
        name: official.name,
        address_line1: address.line1,
        address_line2: makeAddressLine([address.line2, address.line3]),
        address_city: address.city,
        address_state: address.state,
        address_zip: address.zip,
        address_country: "US",
      },
      officeName: office.name,
      district,
      levels: office.levels,
      roles: office.roles,
      link: official.urls?.[0],
    };
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
    return office.officialIndices
      .flatMap((officialIndex) => {
        const official = reps.officials[officialIndex];
        return googleCivicRepsOfficialToOfficialAddresses(office, official);
      })
      .filter((a) => a !== undefined) as OfficialAddress[];
  });
}

type BaseOfficialApiParams = Pick<
  FetchOfficialsParams,
  "address" | "restricts"
>;

type GoogleCivicRepsParams = Pick<FetchOfficialsParams, "googleApiKey"> &
  BaseOfficialApiParams;

/** fetch officials from google civic info API
 * @param {GoogleCivicRepsParams} input params
 * @return {Promise<OfficialAddress[]>} addresses of officials corresponding to address, filtered by restricts
 */
async function fetchOfficialsFromGoogle({
  address,
  googleApiKey,
  restricts,
}: GoogleCivicRepsParams): Promise<OfficialAddress[]> {
  const params = new URLSearchParams({
    address,
    key: googleApiKey,
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

/** fetch officials from blackmad's city council API
 *
 * @param {BaseOfficialApiParams} input params
 * @return {Promise<OfficialAddress[]>} addresses of officials corresponding to address, filtered by restricts
 */
export const fetchRepsFromBlackmad = async ({
  address,
  restricts,
}: BaseOfficialApiParams): Promise<OfficialAddress[]> => {
  const latLng = await getGeocode({ address }).then((results) =>
    getLatLng(results[0])
  );

  const { lat, lng } = latLng;

  const res = await fetch(
    `https://city-council-api.herokuapp.com/lookup?lat=${lat}&lng=${lng}`
  );

  const json = (await res.json()) as BlackmadCityCouncilResponse;

  return blackmadCityCouncilResponseToOfficialAddresses(json, restricts);
};

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

type FetchOfficialsParams = {
  /** address to look up officials for */
  address: string;
  /** google API key for civic info API */
  googleApiKey: string;
  /** restricts on what levels/roles of officials to return */
  restricts?: OfficialRestrict[];
  setIsSearching: (isSearching: boolean) => void;
};

/** fetch officials from google & blackmad APIs based on user address
 *
 * @param {FetchOfficialsParams} input params
 * @return {Promise<OfficialAddress[]>} A list of officials and their addresses
 */
export async function fetchOfficials({
  address,
  googleApiKey,
  setIsSearching,
  restricts,
}: FetchOfficialsParams): Promise<OfficialAddress[]> {
  setIsSearching(true);

  const cityCouncilOnly =
    restricts?.length === 1 &&
    restricts?.[0]?.level === "locality" &&
    restricts?.[0]?.role === "legislatorUpperBody";

  // Make two calls
  // One to google, which has perfect information as far as I can tell for mayorial level and up everywhere
  // Second to blackmad's city council API which tries to fill holes in major cities where google's city council coverage is lacking (SF, NYC)
  let googlePromise: Promise<OfficialAddress[]> = Promise.resolve([]);
  if (!cityCouncilOnly) {
    googlePromise = fetchOfficialsFromGoogle({
      address,
      googleApiKey,
      restricts,
    });
  }

  const blackmadPromise = fetchRepsFromBlackmad({ address, restricts });

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
  setIsSearching(false);
  return officials;
}
