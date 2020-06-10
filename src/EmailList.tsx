import * as React from 'react';
import { v1 as UUIDv1 } from 'uuid';
import { EmailListFilter } from './EmailListFilter';
import { CountryProps, Country } from './Country';

interface EmailListProps {
    countries: Array<CountryProps>;
    /** A tuple with [countryId, countryName]. */
    countryOptions: [number, string][];
    /** A tuple with [regionId, countryId, regionName]. */
    regionOptions: [number, number, string][];
}

export interface EmailListState {
    selectedCountryId?: number | null;
    selectedRegionId?: number | null;
}

/**
 * The main container for email links. Overlays on the list layout.
 */
export class EmailList extends React.Component<EmailListProps, EmailListState> {

    constructor(props: any) {
        super(props);
        this.state = {
            selectedCountryId: null,
            selectedRegionId: null
        }
    }

    renderCountries(countries: CountryProps[]): React.ReactNode {
        const self = this;
        return (countries
            .filter((info: CountryProps) => this.state.selectedCountryId == null || info.countryId == this.state.selectedCountryId))
            .map((info: CountryProps) => {
                const key = UUIDv1();
                return <Country key={key} {...info} selectedRegionId={this.state.selectedRegionId} />
            });

    }

    updateCountrySelect(newSelection: Partial<EmailListState>) {
        this.setState({ selectedRegionId: null, ...newSelection });
    }

    updateRegionSelect(newSelection: Partial<EmailListState>) {
        this.setState(newSelection);
    }

    render() {
        return (
            <div id="container">
                <div id="filters">
                    <EmailListFilter key={UUIDv1()}
                        placeholder="Region"
                        for="selectedRegionId"
                        value={this.state.selectedRegionId}
                        onFilterChange={this.updateRegionSelect.bind(this)}
                        itemSource={this.props.regionOptions.filter(regionOption => this.state.selectedCountryId == null || this.state.selectedCountryId == regionOption[1]).map(regionOption => [regionOption[0], regionOption[2]])} />
                </div>
                <div id="emailLinks">
                    {this.renderCountries(this.props.countries)}
                </div>
            </div>);
    }
}