import React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { addDecorator, addParameters } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { themes, lightTheme, darkTheme } from '../src/styles/theme';

addDecorator(withThemesProvider(themes));
addDecorator(withKnobs);
addParameters({
	backgrounds: [
		{ name: 'dark', value: darkTheme.colors.surfaceL1, default: true },
		{ name: 'light', value: lightTheme.colors.surfaceL1 },
	],
});
