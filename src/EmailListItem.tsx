import * as React from 'react';

declare function copyToClipboard(element: any, link: any, t: any): any;

export interface EmailListItemProps {
	country: string,
	state: string,
	city: string,
	name: string,
	permalink: string,
	countryId?: number,
	regionId?: number
};

export class EmailListItem extends React.Component<EmailListItemProps> {
	constructor(props: EmailListItemProps) {
		super(props);
	}

	render() {
		const self = this;
		return (
			<li data-state={this.props.state}>
				<a href={`${this.props.permalink}?browse`}>{this.props.city} - <i>{this.props.name}</i></a>
				<span className="copyToClipboard" onClick={function (this: HTMLElement) { copyToClipboard(this, self.props.permalink, true) }}>🔗</span>
			</li>
		);
	}
}