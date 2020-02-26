import React from 'react';
import { Header } from './Header';
import { loggedOutUser, loggedInUserWithBalances } from '../../../.storybook/mocks/reducers/wallet';

import { action } from '@storybook/addon-actions';

export default {
	title: 'Header',
};

const sharedProps = {
	toggleTheme: () => action('toggle theme')(),
};

export const headerLoggedOut = () => (
	<Header {...sharedProps} walletInfo={loggedOutUser} currentTheme="dark" />
);

export const headerLoggedIn = () => (
	<Header {...sharedProps} walletInfo={loggedInUserWithBalances} currentTheme="dark" />
);
