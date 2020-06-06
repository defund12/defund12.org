import { PageTitle } from '../build/PageTitle';
import { EmailList } from '../build/EmailList';
import { EmailListItem } from '../build/EmailListItem';
import React from 'react';
import ReactDOM from 'react-dom';

const emailLinks = document.getElementById('emailLinks');
ReactDOM.render(React.createElement(EmailList, null, $(emailLinks.children).map((link, item) => {
    const { state, city, permalink, name } = item.dataset;
    const linkItemProps = { state, city, permalink, name }
    return React.createElement(EmailListItem, linkItemProps);
})), emailLinks);