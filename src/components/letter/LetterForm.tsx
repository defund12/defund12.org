import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";

import * as _ from "lodash";

import "purecss/build/pure-min.css";

import { Template, Address, OfficialRestrict, OfficialAddress } from "./types";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";
import { isTestMode } from "./utils";
import { fetchReps } from "./representative-apis";

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

/** Renders block of addresses with checkboxes from google & citycouncil API responses
 *
 * @return {React.ReactNode} the rendered component
 */
function Addresses({
  addresses,
  onAddressSelected,
  officials,
  myAddress,
}: {
  addresses: Address[];
  officials: OfficialAddress[];
  onAddressSelected: (b: boolean, c: Address) => void;
  restricts?: OfficialRestrict[];
  myAddress: Address;
}) {
  const officialAddresses: OfficialAddress[] =
    (addresses || []).length > 0
      ? addresses.map((address) => {
          return { address };
        })
      : officials;

  if (myAddress.address_line1 && officialAddresses.length === 0) {
    return <div>No representatives found, sorry</div>;
  }

  return (
    <div className="pure-controls">
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
  template: Template;
  googleApiKey: string;
}

/** Renders the overall letter sending form
 *
 * @return {React.ReactNode} the rendered component
 */
function LetterForm({ template, googleApiKey }: Props): ReactElement {
  const [bodyText, setBodyText] = useState(template.template);
  const [bodyTextEdited, setBodyTextEdited] = useState(false);
  const [myAddress, setMyAddress] = useState({} as Address);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as Address[]);
  const [officials, setOfficials] = useState([] as OfficialAddress[]);
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
      fetchReps({
        address: singleLineAddress,
        googleApiKey: googleApiKey,
        cityCouncilOnly: true, // TODO(blackmad) change this
        setIsSearching,
        restricts: [], // TODO(blackmad) change this
      }).then((officialAddress) => setOfficials(officialAddress));
    }
  }, [myAddress]);

  const updateField = (key: string, value: string) => {
    console.log("updateField", { key, value });
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
      console.log("setting text to", newBodyText);
      setBodyText(newBodyText);
    }
  };

  const onBodyTextKeyPress = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="pure-form letter-form">
      <fieldset>
        {isTestMode() && <div className="alert-test">TEST MODE</div>}
        <MyAddressInput updateAddress={updateAddress} />

        <Inputs inputs={variables} updateField={updateField} />
        <div className="row">
          <div className="bodyWrapper">
            <textarea onChange={onBodyTextKeyPress} value={bodyText} />

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
              officials={officials}
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
    </div>
  );
}

export default LetterForm;
