import * as React from "react";
import { TemplateListItemProps } from "../../types/PropTypes";
import { Link } from "gatsby";

/**
 * An individual mail link
 */
export class LetterListItem extends React.Component<TemplateListItemProps> {
  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <li data-state={this.props.state}>
        <Link to={`${this.props.permalink}`}>
          {this.props.city} - <i>{this.props.name}</i>
        </Link>
      </li>
    );
  }
}
