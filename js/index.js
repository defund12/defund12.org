import { EmailList } from '../build/EmailList';
import React from 'react';
import ReactDOM from 'react-dom';


const emailLinks = document.getElementById('emailLinks');
let countryOptions = [];
let regionOptions = [];
let countries = []
let countryId = 0;
let regionId = 0;

$(emailLinks.children).each((link, item) => {
    const { state, city, permalink, name, country } = item.dataset;
    const linkProps = { state, city, permalink, name, country, countryId: 0, regionId: 0 };
    let countrySelectOption;
    let regionSelectOption;
    if (!(countrySelectOption = countryOptions.find(existing => existing[1] === linkProps.country))) {
        countrySelectOption = [++countryId, linkProps.country];
        countryOptions.push(countrySelectOption);
        countries.push({ countryId, name: linkProps.country, regions: [] });
    }
    const countryGroup = countries.find(existingCountry => existingCountry.countryId == countrySelectOption[0]);
    if (!(regionSelectOption = regionOptions.find(existing => existing[2] === linkProps.state))) {
        regionSelectOption = [++regionId, countrySelectOption[0], linkProps.state];
        regionOptions.push(regionSelectOption);
        countryGroup.regions.push({ regionId, name: linkProps.state, templates: [] });
    }
    const region = countryGroup.regions.find(existingRegion => existingRegion.regionId == regionSelectOption[0]);
    linkProps.countryId = countrySelectOption[0];
    linkProps.regionId = regionSelectOption[0];
    region.templates.push(linkProps);
});
const props = { countries: [...countries], countryOptions, regionOptions };

ReactDOM.render(React.createElement(EmailList, props), emailLinks);