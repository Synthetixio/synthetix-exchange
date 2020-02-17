import React from 'react';
import { DataLarge, DataMedium, DataSmall } from './Data';

import { text } from '@storybook/addon-knobs';

export default {
	title: 'Typography/Data',
};

export const large = () => <DataLarge>{text('Text', 'Lorem ipsum')}</DataLarge>;
export const medium = () => <DataMedium>{text('Text', 'Lorem ipsum')}</DataMedium>;
export const small = () => <DataSmall>{text('Text', 'Lorem ipsum')}</DataSmall>;
