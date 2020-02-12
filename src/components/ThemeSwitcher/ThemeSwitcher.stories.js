import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Header',
};

export const themeSwitcherDark = () => (
	<ThemeSwitcher currentTheme="dark" toggleTheme={() => action('toggle theme')()} />
);
export const themeSwitcherLight = () => (
	<ThemeSwitcher currentTheme="light" toggleTheme={() => action('toggle theme')()} />
);
