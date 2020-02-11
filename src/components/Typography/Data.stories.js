import React from 'react';
import { DataLarge, DataMedium, DataSmall } from './Data';

import { text } from '@storybook/addon-knobs';

export default {
	title: 'Typography/Data',
};

export const Large = () => <DataLarge>{text('Text', 'Lorem ipsum')}</DataLarge>;
export const Medium = () => <DataMedium>{text('Text', 'Lorem ipsum')}</DataMedium>;
export const Small = () => <DataSmall>{text('Text', 'Lorem ipsum')}</DataSmall>;
