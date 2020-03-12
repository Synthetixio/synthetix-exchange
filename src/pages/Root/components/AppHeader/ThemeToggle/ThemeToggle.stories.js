import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Header',
};

const sharedProps = {
	toggleTheme: () => action('toggle theme')(),
};

export const themeToggleDark = () => <ThemeToggle {...sharedProps} currentTheme="dark" />;
export const themeToggleLight = () => <ThemeToggle {...sharedProps} currentTheme="light" />;
