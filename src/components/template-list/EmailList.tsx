import TemplateList from "./TemplateList";
import React from "react";

/** List of all emails
 * @return {React.ReactElement} the rendered list
 */
export default function EmailList(): React.ReactElement {
  return <TemplateList layout="email" />;
}
