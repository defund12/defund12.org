import TemplateList from "./TemplateList";
import React from "react";

/** List of all letters
 * @return {React.ReactElement} the rendered list
 */
export default function LetterList(): React.ReactElement {
  return <TemplateList layout="letter" />;
}
