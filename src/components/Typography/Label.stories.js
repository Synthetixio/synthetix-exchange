import React from 'react';
import { LabelMedium, LabelSmall } from './Label';

import { text } from '@storybook/addon-knobs';

export default {
	title: 'Typography/Label',
};

export const Medium = () => <LabelMedium>{text('Text', 'Lorem ipsum')}</LabelMedium>;
export const Small = () => <LabelSmall>{text('Text', 'Lorem ipsum')}</LabelSmall>;
