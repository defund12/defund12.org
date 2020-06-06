import { RegionProps, Region } from "./Region";
import React from "react";
import { v1 as UUIDv1 } from 'uuid';
import { EmailListState } from "./EmailList";

export interface CountryProps {
    countryId: number;
    name: string;
    selectedRegionId?: number | null;
    regions: Array<RegionProps>
}

export class Country extends React.Component<CountryProps, EmailListState> {
    constructor(props: CountryProps) {
        super(props);
    }

    renderRegions() {
        return this.props.regions.filter(region => this.props.selectedRegionId == null || this.props.selectedRegionId == region.regionId).map(region => <Region key={UUIDv1()} {...region} />)
    }

    render() {
        return (
            <div className="country">
                <h1>{this.props.name}</h1>
                {this.renderRegions()}
            </div>
            )
    }
}