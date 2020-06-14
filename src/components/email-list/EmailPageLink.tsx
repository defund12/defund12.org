import * as React from "react";
import { EmailListItemProps } from "../../types/PropTypes";
import { DefundUtils } from "../../DefundUtils";
import { Link } from "gatsby";

interface EmailListItemState {
  /** A boolean indicating whether the copy button was recently clicked,
   * to change to the "✅(copied)" label. */
  clickActive: boolean;
}

/**
 * An individual email link, including copy button.
 */
export class EmailListItem extends React.Component<
  EmailListItemProps,
  EmailListItemState
> {
  copyButtonText = "🔗";
  /**
   * Initialize the component and its state.
   * @param {EmailListItemProps} props
   */
  constructor(props: EmailListItemProps) {
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
      <li data-state={this.props.state}>
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
      </li>
    );
  }
}
