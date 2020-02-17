import React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { addDecorator, addParameters } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import withReduxProvider from './providers/withReduxProvider';
import withReactRouterProvider from './providers/withReactRouterProvider';

import { themes, lightTheme, darkTheme } from '../src/styles/theme';

import './libs/i18n';
import '../src/index.css';

addDecorator(withReduxProvider);
addDecorator(withReactRouterProvider);
addDecorator(withThemesProvider(themes));
addDecorator(withKnobs);
addParameters({
	backgrounds: [
		{ name: 'dark', value: darkTheme.colors.surfaceL1, default: true },
		{ name: 'light', value: lightTheme.colors.surfaceL1 },
	],
});
