import { makeAddressLine } from "./utils";
import {
  BlackmadCityCountilResponse,
  OfficialRestrict,
  GoogleCivicRepsResponse,
  OfficialAddress,
} from "./types";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import _ from "lodash";

export const mungeCityCouncil = (
  cityCouncilMembers: BlackmadCityCountilResponse,
  restricts: OfficialRestrict[]
): OfficialAddress[] => {
  if (
    !cityCouncilMembers ||
    !cityCouncilMembers.data ||
    cityCouncilMembers.data.length === 0
  ) {
    return [];
  }

  return _.flatMap(cityCouncilMembers.data, (cityCouncilMember) => {
    if (
      restricts?.length > 0 &&
      !_.some(
        restricts,
        (restrict) =>
          restrict.level === cityCouncilMember.office.level &&
          restrict.role === cityCouncilMember.office.role
      )
    ) {
      return [];
    }

    let link: string;
    if (cityCouncilMember.body === "New York City Council") {
      link = `https://defund-nypd-reps.glitch.me/district/${cityCouncilMember.district}`;
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
      };
    });
  });
};

export const mungeReps = (
  reps: GoogleCivicRepsResponse,
  restricts: OfficialRestrict[]
): OfficialAddress[] => {
  if (!reps.offices) {
    return [];
  }

  const offices = reps.offices.filter((office) => {
    if (
      !office.roles &&
      office.levels.includes("locality") &&
      office.name.includes("Council")
    ) {
      office.roles = ["legislatorUpperBody"];
    }

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
    return !isPresidenty && !isJudgy;
  });

  return _.flatMap(offices, (office) => {
    if (
      restricts?.length > 0 &&
      !_.some(
        restricts,
        (restrict) =>
          (office.levels || []).includes(restrict.level) &&
          (office.roles || []).includes(restrict.role)
      )
    ) {
      return [];
    }

    return office.officialIndices
      .map((officialIndex) => {
        // divisionId: "ocd-division/country:us/state:pa/place:philadelphia/council_district:1",
        const districtPattern = /:(\d+)$/;
        let district: string | undefined;
        if (districtPattern.test(office.divisionId)) {
          district = office.divisionId.match(districtPattern)?.[1];
        }

        const official = reps.officials[officialIndex];
        if (!official.address || official.address.length === 0) {
          return undefined;
        }
        const address = official.address[0];
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
        };
      })
      .filter((a) => a !== undefined) as OfficialAddress[];
  });
};

export const fetchRepsFromGoogle = async ({
  address,
  googleApiKey,
  restricts,
}: {
  address: string;
  googleApiKey: string;
  restricts: OfficialRestrict[];
}): Promise<OfficialAddress[]> => {
  const params = new URLSearchParams({
    address,
    key: googleApiKey,
  }).toString();

  return fetch(
    "https://www.googleapis.com/civicinfo/v2/representatives?" + params
  ).then((res) => {
    return res.json().then((data) => {
      return mungeReps(data as GoogleCivicRepsResponse, restricts);
    });
  });
};

export const fetchRepsFromBlackmad = async ({
  address,
  restricts,
}: {
  address: string;
  restricts: OfficialRestrict[];
}): Promise<OfficialAddress[]> => {
  const latLng = await getGeocode({ address }).then((results) =>
    getLatLng(results[0])
  );

  const { lat, lng } = latLng;

  const res = await fetch(
    `https://city-council-api.herokuapp.com/lookup?lat=${lat}&lng=${lng}`
  );

  const json = (await res.json()) as BlackmadCityCountilResponse;

  // const districtEntry = data.data.find((o) => Boolean(o.district));
  // if (districtEntry) {
  //   updateField("YOUR DISTRICT", districtEntry.district);
  // }
  return mungeCityCouncil(json, restricts);
};

export const fetchReps = async ({
  address,
  googleApiKey,
  cityCouncilOnly,
  setIsSearching,
  restricts,
}: {
  address: string;
  googleApiKey: string;
  cityCouncilOnly: boolean;
  setIsSearching: (isSearching: boolean) => void;
  restricts: OfficialRestrict[];
}): Promise<OfficialAddress[]> => {
  const officialsPromises: Promise<OfficialAddress[]>[] = [];
  setIsSearching(true);

  if (!cityCouncilOnly) {
    officialsPromises.push(
      fetchRepsFromGoogle({ address, googleApiKey, restricts })
    );
  }

  officialsPromises.push(fetchRepsFromBlackmad({ address, restricts }));

  const officials = _.flatten(await Promise.all(officialsPromises));
  setIsSearching(false);
  return officials;
};
