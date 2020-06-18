import React, { useState, useEffect, ReactElement } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";

import * as _ from "lodash";

import "purecss/build/pure-min.css";

import {
  Template,
  Address,
  GoogleCivicRepsResponse,
  BlackmadCityCountilResponse,
  OfficialRestrict,
} from "./types";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";
import { isTestMode } from "./utils";

const SpecialVars = ["YOUR NAME", "YOUR DISTRICT"];

/** parses out the [SOME VARIABLE] names from template, minus the ones mentioned in SpecialVars
 *
 * @param {string} template the defund12 template to parse
 * @return {string[]} list of parameter names without brackets minus SpecialVars
 */
function parseVars(template: string): string[] {
  const match = template.match(/\[[^\]]+\]/g);
  return _.uniq(match?.map((s) => s.replace("[", "").replace("]", ""))).filter(
    (v) => !SpecialVars.includes(v)
  );
}

const addressToSingleLine = (address: Address): string => {
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

type OfficialAddress = {
  officeName?: string;
  address: Address;
  link?: string;
};

const makeAddressLine = (parts: string[]): string | undefined => {
  const partsToUse = parts.filter((p) => Boolean(p));
  if (partsToUse.length > 0) {
    return partsToUse.join(", ");
  } else {
    return undefined;
  }
};

const mungeCityCouncil = (
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

const mungeReps = (
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

/** Renders block of addresses with checkboxes from google & citycouncil API responses
 *
 * @return {React.ReactNode} the rendered component
 */
function Addresses({
  addresses,
  onAddressSelected,
  reps,
  cityCouncilMembers,
  restricts,
  myAddress,
}: {
  addresses: Address[];
  reps: GoogleCivicRepsResponse;
  cityCouncilMembers: BlackmadCityCountilResponse;
  onAddressSelected: (b: boolean, c: Address) => void;
  restricts?: OfficialRestrict[];
  myAddress: Address;
}) {
  const officialAddresses: OfficialAddress[] =
    (addresses || []).length > 0
      ? addresses.map((address) => {
          return { address };
        })
      : [
          ...mungeCityCouncil(cityCouncilMembers, restricts || []),
          ...mungeReps(reps, restricts || []).reverse(),
        ];

  if (myAddress.address_line1 && officialAddresses.length === 0) {
    return <div>No representatives found, sorry</div>;
  }

  return (
    <div class="pure-controls">
      {officialAddresses?.map((officialAddress) => {
        const address = officialAddress.address;
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onAddressSelected(event.target.checked, address);
        };
        const key = `${address.name}:${officialAddress.officeName}`;
        return (
          <label className="pure-checkbox" key={key}>
            <input type="checkbox" onChange={onChange} />
            <>
              <b>{address.name}</b>
              {officialAddress.officeName && ` (${officialAddress.officeName})`}
              , {addressToSingleLine(address)}{" "}
              {officialAddress.link && (
                <a target="_blank" href={officialAddress.link}>
                  Read about their positions
                </a>
              )}
            </>
          </label>
        );
      })}
    </div>
  );
}

/** Renders all the input fields to fill in the letter and complete the transaction
 *
 * @return {React.ReactNode} the rendered component
 */
function Inputs({
  inputs,
  updateField,
}: {
  inputs: string[];
  updateField: (key: string, value: string) => void;
}) {
  return (
    <fieldset className="pure-form-aligned ">
      {inputs.map((input) => {
        const onChange = (
          event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => {
          updateField(input, event.target.value);
        };
        return (
          <div className="pure-control-group" key={input}>
            <label>{_.startCase(_.toLower(input))}</label>
            <input type="text" onChange={onChange} />
          </div>
        );
      })}
    </fieldset>
  );
}

interface Props {
  template?: Template;
}

/** Renders the overall letter sending form
 *
 * @return {React.ReactNode} the rendered component
 */
function LetterForm({ template }: Props): ReactElement {
  const [bodyText, setBodyText] = useState(template.template);
  const [bodyTextEdited, setBodyTextEdited] = useState(false);
  const [myAddress, setMyAddress] = useState({} as Address);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as Address[]);
  const [reps, setReps] = useState({} as GoogleCivicRepsResponse);
  const [cityCouncilMembers, setCityCouncilMembers] = useState(
    {} as BlackmadCityCountilResponse
  );
  const [isSearching, setIsSearching] = useState(false);

  let variables = parseVars(template.template) || [];
  const emailKey = _.find(variables, (v) =>
    v.toLocaleLowerCase().includes("email")
  );

  if (!emailKey) {
    variables = [...variables, "YOUR EMAIL"];
  }

  useEffect(() => {
    if (
      !myAddress.address_city ||
      !myAddress.address_line1 ||
      !myAddress.address_state ||
      !myAddress.address_zip
    ) {
      return;
    }

    if (!template.addresses || template.addresses.length === 0) {
      const singleLineAddress = addressToSingleLine(myAddress);

      const params = new URLSearchParams({
        address: singleLineAddress,
      }).toString();

      if (!template.cityCouncilOnly) {
        setIsSearching(true);
        fetch(
          "https://us-central1-political-postcards.cloudfunctions.net/api/findReps?" +
            params
        ).then((res) => {
          res.json().then((data) => {
            setReps(data as GoogleCivicRepsResponse);
            setIsSearching(false);
          });
        });
      }

      setIsSearching(true);
      getGeocode({ address: singleLineAddress })
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          const { lat, lng } = latLng;

          fetch(
            `https://city-council-api.herokuapp.com/lookup?lat=${lat}&lng=${lng}`
          ).then((res) => {
            res.json().then((data: BlackmadCityCountilResponse) => {
              setIsSearching(false);
              const districtEntry = data.data.find((o) => Boolean(o.district));
              if (districtEntry) {
                updateField("YOUR DISTRICT", districtEntry.district);
              }

              setCityCouncilMembers(data);
            });
          });
        });
    }
  }, [myAddress]);

  const updateField = (key: string, value: string) => {
    const newMap = { ...variableMap };
    newMap[key] = value;
    setVariableMap(newMap);

    if (bodyTextEdited) {
      setBodyText(bodyText.replace(new RegExp(`\\[${key}\\]`, "g"), value));
    } else {
      let newBodyText = template.template;
      _.forEach(newMap, (value, key) => {
        newBodyText = newBodyText.replace(
          new RegExp(`\\[${key}\\]`, "g"),
          value
        );
      });
      setBodyText(newBodyText);
    }
  };

  const onBodyTextKeyPress = (event: any) => {
    setBodyTextEdited(true);
    setBodyText(event.target.value);
  };

  const onAddressSelected = (isChecked: boolean, address: Address) => {
    if (isChecked) {
      setCheckedAddresses(_.uniq([...checkedAddresses, address]));
    } else {
      setCheckedAddresses(
        checkedAddresses.filter((a) => {
          return JSON.stringify(a) !== JSON.stringify(address);
        })
      );
    }
  };

  const updateAddress = (address: Address) => {
    // console.log("updating address);
    setMyAddress(address);

    updateField("YOUR NAME", address.name);
  };

  const hasAllKeys =
    _.difference([...variables, ...SpecialVars], _.keys(variableMap)).length ===
    0;

  const email = variableMap[emailKey!];

  return (
    <form className="pure-form letter-form">
      <fieldset>
        {isTestMode() && <div className="alert-test">TEST MODE</div>}
        <MyAddressInput updateAddress={updateAddress} />

        <Inputs inputs={variables} updateField={updateField} />
        <div className="row">
          <div
            style={{
              background: "cornsilk",
              margin: "10px",
              padding: "10px",
              // whiteSpace: "pre-wrap",
              width: "100%",
              height: "60vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <textarea onChange={onBodyTextKeyPress}>{bodyText}</textarea>

            {template.notes && (
              <div
                style={{
                  fontStyle: "italic",
                  textAlign: "right",
                }}
                className="p-1"
              >
                {template.notes}
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 pb-2">
          {isSearching ? (
            <div>Searching for representatives ...</div>
          ) : (
            <Addresses
              reps={reps}
              cityCouncilMembers={cityCouncilMembers}
              addresses={template.addresses || []}
              onAddressSelected={onAddressSelected}
              restricts={template.officialRestricts}
              myAddress={myAddress}
            />
          )}

          <CheckoutForm
            checkedAddresses={checkedAddresses}
            myAddress={myAddress}
            body={bodyText}
            formValid={hasAllKeys}
            email={email}
            variables={variableMap}
          />
        </div>
      </fieldset>
    </form>
  );
}

export default LetterForm;
