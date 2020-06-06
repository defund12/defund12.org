import { App } from '../build/App';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
function getParams(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function extractLinkPropsFromData(item) {
    const { state, city, permalink, name, country } = item.dataset;
    const linkProps = { state, city, permalink, name, country, countryId: 0, regionId: 0 };
    return linkProps;
}

// initialize state containers
let countryOptions = [];
let regionOptions = [];
let countries = []
let countryId = 0;
let regionId = 0;

// get the list that jekyll rendered
const emailLinks = document.getElementById('emailLinks');


$(emailLinks.children).each((link, item) => {
    const linkProps = extractLinkPropsFromData(item);
    let countrySelectOption;
    let regionSelectOption;

    // find or create the current link's country info
    if (!(countrySelectOption = countryOptions.find(existing => existing[1] === linkProps.country))) {
        countrySelectOption = [++countryId, linkProps.country];
        countryOptions.push(countrySelectOption);
        countries.push({ countryId, name: linkProps.country, regions: [] });
    }
    const countryGroup = countries.find(existingCountry => existingCountry.countryId == countrySelectOption[0]);

    // find or create the current link's region info
    if (!(regionSelectOption = regionOptions.find(existing => existing[2] === linkProps.state))) {
        regionSelectOption = [++regionId, countrySelectOption[0], linkProps.state];
        regionOptions.push(regionSelectOption);
        countryGroup.regions.push({ regionId, name: linkProps.state, templates: [] });
    }
    const region = countryGroup.regions.find(existingRegion => existingRegion.regionId == regionSelectOption[0]);

    // save the generated IDs back to the link info
    linkProps.countryId = countrySelectOption[0];
    linkProps.regionId = regionSelectOption[0];

    // add the link to its region
    region.templates.push(linkProps);
});

const appContainer = document.getElementById('react-container');
const { title, subtitle, footer_text } = appContainer.dataset;
const props = { title, subtitle, footerText: footer_text, countries: [...countries], countryOptions, regionOptions };
ReactDOM.render(React.createElement(App, props), appContainer)
