import React from 'react';
import { action } from '@storybook/addon-actions';

import ButtonPrimary, { ButtonPrimarySmall } from './ButtonPrimary';

export default {
	title: 'Buttons',
};

export const primary = () => <ButtonPrimary onClick={action('clicked')}>primary</ButtonPrimary>;

export const primarySmall = () => (
	<ButtonPrimarySmall onClick={action('clicked')}>primary small</ButtonPrimarySmall>
);
