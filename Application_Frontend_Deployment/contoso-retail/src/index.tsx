// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import {  createTheme, Customizations }  from '@fluentui/react';
// Import Fluent Icons
import { initializeIcons } from '@uifabric/icons';

initializeIcons();

const myTheme = createTheme({
  palette: {
    themePrimary: '#556ae5',
    themeLighterAlt: '#f8f9fe',
    themeLighter: '#e2e5fb',
    themeLight: '#c9d0f7',
    themeTertiary: '#95a3f0',
    themeSecondary: '#687be9',
    themeDarkAlt: '#4c60cf',
    themeDark: '#4151ae',
    themeDarker: '#303c81',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#bab8b7',
    neutralSecondary: '#a3a2a0',
    neutralPrimaryAlt: '#8d8b8a',
    neutralPrimary: '#323130',
    neutralDark: '#605e5d',
    black: '#494847',
    white: '#ffffff',
  }});

Customizations.applySettings({ theme: myTheme });
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
