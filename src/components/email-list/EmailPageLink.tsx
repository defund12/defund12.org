import * as React from 'react';
import { EmailListItemProps } from '../../types/PropTypes';
import { Link } from 'gatsby';
import { DefundUtils } from '../../DefundUtils';

interface EmailListItemState {
	/** A boolean indicating whether the copy button was recently clicked, to change to the "✅(copied)" label. */
	clickActive: boolean;
}

/**
 * An individual email link, including copy button.
 */
export class EmailListItem extends React.Component<EmailListItemProps, EmailListItemState> {
	copyButtonText: string = '🔗';
	constructor(props: EmailListItemProps) {
		super(props);
		this.state = {
			clickActive: false
        }
	}


	handleClipboardCopy() {
		this.setState({ clickActive: true });
		DefundUtils.copyToClipboard(this.props.permalink, true)
	}

	render() {
		const self = this;
		return (
			<li data-state={this.props.state}>
				<Link to={`${this.props.permalink}?browse`}>{this.props.city} - <i>{this.props.name}</i></Link>
				<span tab-index="0" role="button" aria-label="copy to clipboard" className="copyToClipboard" onClick={this.handleClipboardCopy.bind(this)}>{(this.state.clickActive ? '✅(copied)' : '🔗')}</span>
			</li>
		);
	}
}