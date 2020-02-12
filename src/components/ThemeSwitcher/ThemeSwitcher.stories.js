import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Header',
};

const sharedProps = {
	toggleTheme: () => action('toggle theme')(),
};

export const themeSwitcherDark = () => <ThemeSwitcher {...sharedProps} currentTheme="dark" />;
export const themeSwitcherLight = () => <ThemeSwitcher {...sharedProps} currentTheme="light" />;
