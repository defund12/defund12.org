import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";

import * as _ from "lodash";

import "purecss/build/pure-min.css";

import { Template, Address, OfficialAddress } from "./types";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";
import { isTestMode, addressToSingleLine } from "./utils";
import { fetchReps } from "./representative-apis";
import { OfficialAddressCheckboxList } from "./OfficialAddressCheckboxList";
import { TemplateInputs } from "./TemplateInputs";

const SpecialVars = ["YOUR NAME"]; // , "YOUR DISTRICT"];

/** parses out the [SOME VARIABLE] names from template, minus the ones mentioned in SpecialVars
 * ensure there is a key that a user can enter their email into
 *
 * @param {string} template the defund12 template to parse
 * @return {Object} variables: a list of parameter names without brackets minus SpecialVars,
 *                  emailKey:  a key in the variables where a user's email address will go
 */
function parseVars(
  template: string
): { variables: string[]; emailKey: string } {
  const match = template.match(/\[[^\]]+\]/g);
  const variables = _.uniq(
    match?.map((s) => s.replace("[", "").replace("]", ""))
  ).filter((v) => !SpecialVars.includes(v));

  // If there isn't one that includes "email", add it
  // because we need an email to send people verification their letter went through
  let emailKey = _.find(variables, (v) =>
    v.toLocaleLowerCase().includes("email")
  );

  if (!emailKey) {
    variables.push("YOUR EMAIL");
    emailKey = "YOUR EMAIL";
  }

  return { variables, emailKey };
}

/** Renders the overall letter sending form
 *
 * @return {React.ReactNode} the rendered component
 */
function LetterForm({
  template,
  googleApiKey,
}: {
  template: Template;
  googleApiKey: string;
}): ReactElement {
  const [bodyText, setBodyText] = useState(template.template);
  const [bodyTextEdited, setBodyTextEdited] = useState(false);
  const [myAddress, setMyAddress] = useState({} as Address);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as Address[]);
  const [officials, setOfficials] = useState([] as OfficialAddress[]);
  const [isSearching, setIsSearching] = useState(false);

  // When the inputted address changes, if it is fully specified
  // geocode it and search for representatives' addresses
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
        setIsSearching,
        restricts: template.officialRestricts,
      }).then((officialAddress) => setOfficials(officialAddress));
    }
  }, [myAddress]);

  // When user-inputted fields change, update them in our variable map,
  // and (try) to update the body text
  //
  // If the user has edited the template, then just try our best to replace
  // the variable in there, if not, replace it from the original template.
  //
  // We do this because if the variable is [YOUR BOROUGH] and the user
  // starts typing "B" and we replace [YOUR BOROUGH] with B, it's very hard
  // to replace the right part of the letter with the new value. This is especially
  // because we are listening onChange (vs onBlur) *because* chrome doesn't fire onBlur
  // for auto-filled addresses!
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

  // If the user edits the textarea, mark it dirty (see comment above)
  const onBodyTextKeyPress = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBodyTextEdited(true);
    setBodyText(event.target.value);
  };

  // Address selection logic
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

  // This is the handler we pass to the user address MyAddressInput sub-component
  const updateAddress = (address: Address) => {
    setMyAddress(address);

    updateField("YOUR NAME", address.name);
  };

  // Pull all the variables out of our template
  const { variables, emailKey } = parseVars(template.template);

  // Has the user filled out all the fields?
  const hasAllKeys =
    _.difference([...variables, ...SpecialVars], _.keys(variableMap)).length ===
    0;

  return (
    <div className="pure-form letter-form">
      <fieldset>
        {isTestMode() && <div className="alert-test">TEST MODE</div>}
        <MyAddressInput updateAddress={updateAddress} />

        <TemplateInputs inputs={variables} updateField={updateField} />
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
            <OfficialAddressCheckboxList
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
            email={variableMap[emailKey!]}
            variables={variableMap}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default LetterForm;
