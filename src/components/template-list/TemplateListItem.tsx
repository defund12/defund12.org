import * as React from "react";
import { TemplateListItemProps } from "../../types/PropTypes";
import { DefundUtils } from "../../DefundUtils";
import { Link } from "gatsby";
import styled from "@emotion/styled";

interface TemplateListItemState {
  /** A boolean indicating whether the copy button was recently clicked,
   * to change to the "✅(copied)" label. */
  clickActive: boolean;
}

/**
 * An individual Template link, including copy button.
 */
export class TemplateListItem extends React.Component<
  TemplateListItemProps,
  TemplateListItemState
> {
  copyButtonText = "🔗";
  /**
   * Initialize the component and its state.
   * @param {TemplateListItemProps} props
   */
  constructor(props: TemplateListItemProps) {
    super(props);
    this.state = {
      clickActive: false,
    };
  }

  /**
   * Handles changing the component state appropriately before copying
   * link content.
   */
  handleClipboardCopy(): void {
    this.setState({ clickActive: true });
    DefundUtils.copyToClipboard(this.props.permalink, true);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <StyledList data-state={this.props.state}>
        <Link to={`${this.props.permalink}?browse`}>
          {this.props.city} - <i>{this.props.name}</i>
        </Link>
        <span
          tab-index="0"
          role="button"
          aria-label="copy to clipboard"
          className="copyToClipboard"
          onClick={this.handleClipboardCopy.bind(this)}
        >
          {this.state.clickActive ? "✅(copied)" : "🔗"}
        </span>
      </StyledList>
    );
  }
}

const StyledList = styled.li`
  .copyToClipboard {
    margin-left: var(--x1);
    cursor: copy;
  }
`;
