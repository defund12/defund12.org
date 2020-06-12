import * as React from 'react';

export interface EmailInfo {
	state: string,
	city: string,
	name: string,
	permalink: string,
};

interface EmailListItemProps {
	emailInfo: EmailInfo
}

interface EmailListItemState {
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
			<li data-state={this.props.emailInfo.state}>
				<a href={`${this.props.emailInfo.permalink}?browse`}>{this.props.emailInfo.city} - <i>{this.props.emailInfo.name}</i></a>
				<span tab-index="0" role="button" aria-label="copy to clipboard" className="copyToClipboard" onClick={() => this.copyToClipboard(self.props.emailInfo.permalink, true)}>{(this.state.clickActive ? '✅(copied)' : '🔗')}</span>
			</li>
		);
	}
}