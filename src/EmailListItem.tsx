import * as React from 'react';

export interface EmailListItemProps {
		state: string,
	city: string,
	name: string,
	permalink: string,
	countryId?: number,
	regionId?: number
};

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
			<li data-state={this.props.state}>
				<a href={`${this.props.permalink}?browse`}>{this.props.city} - <i>{this.props.name}</i></a>
				<span className="copyToClipboard" onClick={() => this.copyToClipboard(self.props.permalink, true)}>{(this.state.clickActive ? '✅(copied)' : '🔗')}</span>
			</li>
		);
	}
}