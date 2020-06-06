import * as React from 'react';
import { EmailListItemProps, EmailListItem } from './EmailListItem';
import { v1 as UUIDv1 } from 'uuid';
import { EmailListFilter } from './EmailListFilter';
import { CountryProps, Country } from './Country';


interface EmailListProps {
    countries: Array<CountryProps>;
    countryOptions: [number, string][];
    regionOptions: [number, number, string][];
}

export interface EmailListState {
    selectedCountryId?: number | null;
    selectedRegionId?: number | null;
}

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
            <div>
                <EmailListFilter key={UUIDv1()}
                    placeholder="Country"
                    for="selectedCountryId"
                    value={this.state.selectedCountryId}
                    onFilterChange={this.updateCountrySelect.bind(this)}
                    itemSource={this.props.countryOptions} />
                <EmailListFilter key={UUIDv1()}
                    placeholder="Region"
                    for="selectedRegionId"
                    value={this.state.selectedRegionId}
                    onFilterChange={this.updateRegionSelect.bind(this)}
                    itemSource={this.props.regionOptions.filter(regionOption => this.state.selectedCountryId == null || this.state.selectedCountryId == regionOption[1]).map(regionOption => [regionOption[0], regionOption[2]])} />
                {this.renderCountries(this.props.countries)}
            </div>);
    }
}