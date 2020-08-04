import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";
import TextareaAutosize from "react-autosize-textarea";

import * as _ from "lodash";

import "purecss/build/pure-min.css";
import "purecss/build/grids-responsive-min.css";

import { Template, LobAddress } from "./LetterTypes";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";
import AddressInput from "./AddressInput";
import { CombinedOfficialFetchingService } from "../../services/CombinedOfficialFetchingService";
import { OfficialAddressCheckboxList } from "./OfficialAddressCheckboxList";
import { TemplateInputs } from "./TemplateInputs";
import { OfficialAddress } from "../../services/OfficialTypes";
import { lobAddressToSingleLine } from "./LobAddressUtils";
import { DynamicList } from "../common";

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
    const DEFAULT_EMAIL_ADDRESS_VARIABLE = "YOUR EMAIL ADDRESS";
    variables.push(DEFAULT_EMAIL_ADDRESS_VARIABLE);
    emailKey = DEFAULT_EMAIL_ADDRESS_VARIABLE;
  }

  return { variables, emailKey };
}

type LetterFormProps = {
  /** the template of the letter */
  template: Template;
  /** google api key for calling google civic api */
  googleApiKey: string;
};

/** Renders the overall letter sending form
 *
 * @param {LetterFormProps} the component props
 * @return {ReactElement} the rendered component
 */
function LetterForm({ template, googleApiKey }: LetterFormProps): ReactElement {
  const [bodyText, setBodyText] = useState(template.template);
  const [bodyTextEdited, setBodyTextEdited] = useState(false);
  const [myAddress, setMyAddress] = useState({} as LobAddress);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as LobAddress[]);
  const [additionalAddresses, setAdditionalAddresses] = useState(
    [] as LobAddress[]
  );
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
      const singleLineAddress = lobAddressToSingleLine(myAddress);
      const officialsFetcher = new CombinedOfficialFetchingService(
        googleApiKey
      );
      setIsSearching(true);
      officialsFetcher
        .fetch({
          address: singleLineAddress,
          restricts: template.officialRestricts,
        })
        .then((officialAddress) => {
          setOfficials(officialAddress);
          setIsSearching(false);
        });
    }
  }, [myAddress]);

  /** When user-inputted fields change, update them in our variable map,
    * and (try) to update the body text

    If the user has edited the template, then just try our best to replace
    the variable in there, if not, replace it from the original template.

    We do this because if the variable is [YOUR BOROUGH] and the user
    starts typing "B" and we replace [YOUR BOROUGH] with B, it's very hard
    to replace the right part of the letter with the new value. This is especially
    because we are listening onChange (vs onBlur) *because* chrome doesn't fire onBlur
    for auto-filled addresses!

    * @param {string} key the key that was updated like YOUR NAME or BOROUGH
    * @param {sting} value the user entered value
    */
  function updateField(key: string, value: string) {
    const newMap = { ...variableMap };
    if (!value) {
      delete newMap[key];
    } else {
      newMap[key] = value;
    }
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
  }

  /** If the user edits the textarea, mark it dirty and set the new body text
   * @param {ChangeEvent} event the event generated by use typing into the body textarea
   */
  function onBodyTextKeyPress(event: ChangeEvent<HTMLTextAreaElement>) {
    setBodyTextEdited(true);
    setBodyText(event.target.value);
  }

  /** Callback for when a user clicks a checkbox on an address so we
   * can update our list of currently checked addresses
   * @param {boolean} isChecked was the address checked or unchecked
   * @param {Address} address the address in question
   */
  function onAddressSelected(isChecked: boolean, address: LobAddress) {
    if (isChecked) {
      setCheckedAddresses(_.uniq([...checkedAddresses, address]));
    } else {
      setCheckedAddresses(
        checkedAddresses.filter((a) => {
          return JSON.stringify(a) !== JSON.stringify(address);
        })
      );
    }
  }

  /** This is the handler we pass to the user address MyAddressInput sub-component
   * @param {Address} address the user inputted address
   */
  function updateMyAddress(address: LobAddress) {
    setMyAddress(address);

    updateField("YOUR NAME", address.name);
  }

  // Pull all the variables out of our template
  const { variables, emailKey } = parseVars(template.template);

  // Has the user filled out all the fields?
  const allVariablesFilledIn =
    _.difference([...variables, ...SpecialVars], _.keys(variableMap)).length ===
    0;

  return (
    <div className="pure-form pure-form-stacked letter-form">
      <fieldset>
        <MyAddressInput updateAddress={updateMyAddress} />

        <TemplateInputs variables={variables} updateField={updateField} />
        <div className="pure-control-group">
          <label>Letter Body</label>

          <TextareaAutosize onChange={onBodyTextKeyPress} value={bodyText} />

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

        <div className="pt-2 pb-2">
          {isSearching ? (
            <div>Searching for representatives ...</div>
          ) : (
            <OfficialAddressCheckboxList
              officials={officials}
              addresses={template.addresses || []}
              onAddressSelected={onAddressSelected}
              myAddress={myAddress}
            />
          )}

          <DynamicList
            addText={(addresses) =>
              addresses.length === 0
                ? "Add Missing Representative"
                : "Add Another"
            }
            onListItemsUpdated={setAdditionalAddresses}
            modelFactory={() => ({} as LobAddress)}
            renderListItem={(onListItemUpdated: (a: LobAddress) => void) => (
              <AddressInput onAddressUpdated={onListItemUpdated} />
            )}
          />

          <CheckoutForm
            checkedAddresses={[...checkedAddresses, ...additionalAddresses]}
            myAddress={myAddress}
            body={bodyText}
            allVariablesFilledIn={allVariablesFilledIn}
            email={variableMap[emailKey!]}
          />
        </div>
      </fieldset>
      <br></br>
      <h6>
        Powered by <a href="https://lob.com">Lob</a> and{" "}
        <a href="https://stripe.com">Stripe</a>.
      </h6>
      <br></br>
    </div>
  );
}

export default LetterForm;
