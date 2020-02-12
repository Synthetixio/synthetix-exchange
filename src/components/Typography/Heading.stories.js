import React from 'react';
import { HeadingMedium, HeadingSmall } from './Heading';

import { text } from '@storybook/addon-knobs';

export default {
	title: 'Typography/Heading',
};

export const medium = () => <HeadingMedium>{text('Text', 'Lorem ipsum')}</HeadingMedium>;
export const small = () => <HeadingSmall>{text('Text', 'Lorem ipsum')}</HeadingSmall>;
