import React, { ReactElement } from "react";
import * as _ from "lodash";

/** Renders all the input fields to fill in the letter and complete the transaction
 *
 * @return {ReactElement} the rendered component
 */
export function TemplateInputs({
  inputs,
  updateField,
}: {
  inputs: string[];
  updateField: (key: string, value: string) => void;
}): ReactElement {
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
