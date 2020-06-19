import React, { ReactElement } from "react";
import * as _ from "lodash";

type TemplateInputProps = {
  /** A list of variable names to render input elements for */
  variables: string[];
  /** called when a variable input is updated (onChange) with the variable name and new value */
  updateField: (key: string, value: string) => void;
};

/** Renders all the input fields to fill in the letter and complete the transaction
 *
 * @return {ReactElement} the rendered component
 */
export function TemplateInputs({
  variables,
  updateField,
}: TemplateInputProps): ReactElement {
  return (
    <fieldset className="pure-form-aligned ">
      {variables.map((input) => {
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
