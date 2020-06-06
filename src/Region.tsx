import { EmailListItemProps, EmailListItem } from "./EmailListItem";
import React from "react";
import { v1 as UUIDv1 } from 'uuid';
import { EmailListState } from "./EmailList";

export interface RegionProps {
    regionId: number;
    name: string;
    templates: Array<EmailListItemProps>
}

export class Region extends React.Component<RegionProps, EmailListState> {
    constructor(props: RegionProps) {
        super(props);
    }

    renderTemplateLinks(): React.ReactNode {
        return this.props.templates.map(linkInfo => <EmailListItem key={UUIDv1()} {...linkInfo} />);
    }

    render() {
        return (
            <div className="state">
                <h2>{this.props.name}</h2>
                {this.renderTemplateLinks()}
            </div>
            )
    }
}