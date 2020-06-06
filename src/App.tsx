import React from 'react';
import { EmailList } from './EmailList';
import { Header } from './Header';
import { Footer } from './Footer';
import { CountryProps } from './Country';

interface AppProps {
    title: string;
    subtitle: string;
    footerText: string;
    countries: Array<CountryProps>;
    countryOptions: Array<[number, string]>;
    regionOptions: Array<[number, number, string]>;
}

export class App extends React.Component<AppProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header title={this.props.title} subtitle={this.props.subtitle} />
                <div className="content">
                    <div className="container">
                        <EmailList countries={this.props.countries} countryOptions={this.props.countryOptions} regionOptions={this.props.regionOptions} />
                        <Footer footerText={this.props.footerText} />
                    </div>
                </div>
            </div>
        );
    }
}