import { Defund12App } from "../build/App";
import React from 'react';
import ReactDOM from 'react-dom';

const appContainer = document.getElementsByClassName('pagetitle');
ReactDOM.render(React.createElement(Defund12App, { title: appContainer[0].innerText }), appContainer[0]);