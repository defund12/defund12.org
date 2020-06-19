import React, { ReactElement } from "react";
import * as _ from "lodash";

type TemplateInputProps = {
  /** A list of variable names to render input elements for */
  variables: string[];
  /** called when a variable input is updated (onChange) with the variable name and new value */
  updateField: (key: string, value: string) => void;
};

const allUpperCaseLabelRegex = new RegExp(/^[A-Z ]+$/);

/** Renders all the input fields to fill in the letter and complete the transaction
 *
 * @return {ReactElement} the rendered component
 */
export function TemplateInputs({
  variables,
  updateField,
}: TemplateInputProps): ReactElement {
  return (
    <>
      {variables.map((variable) => {
        const onChange = (
          event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => {
          updateField(variable, event.target.value);
        };

        // If the variable is something like YOUR NAME, turn it into "Your Name"
        // If it's anything else like "What is your favorite color?" leave it alone
        const label = allUpperCaseLabelRegex.test(variable)
          ? _.startCase(_.toLower(variable))
          : variable;

        return (
          <fieldset>
            <div className="pure-control-group" key={variable}>
              <label>{label}</label>
              <input className="pure-u-1" type="text" onChange={onChange} />
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
