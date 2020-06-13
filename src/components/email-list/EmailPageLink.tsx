import * as React from 'react';
import { EmailListItemProps } from '../../types/PropTypes';

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

	copyToClipboard(copyText: string, isPermalink: boolean) {
		this.setState({ clickActive: true });
		setTimeout(() => this.setState({ clickActive: false }), 2000);

		const element = document.createElement("textarea");
		let copyValue = copyText;
		if (isPermalink) {
			copyValue = "https://defund12.org".concat(copyText);
		}
		element.value = copyValue;
		document.body.appendChild(element);
		element.select();
		document.execCommand("copy");
		document.body.removeChild(element);
	}

	render() {
		const self = this;
		return (
			<li data-state={this.props.state}>
				<a href={`${this.props.permalink}?browse`}>{this.props.city} - <i>{this.props.name}</i></a>
				<span tab-index="0" role="button" aria-label="copy to clipboard" className="copyToClipboard" onClick={() => this.copyToClipboard(self.props.permalink, true)}>{(this.state.clickActive ? '✅(copied)' : '🔗')}</span>
			</li>
		);
	}
}