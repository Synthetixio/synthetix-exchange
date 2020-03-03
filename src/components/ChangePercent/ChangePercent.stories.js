import React from 'react';
import { ChangePercent } from './ChangePercent';

export default {
	title: 'Data/Label',
};

export const positive = () => <ChangePercent value={2.3} />;
export const negative = () => <ChangePercent value={-1.5} />;
export const positiveLabel = () => <ChangePercent value={2.3} isLabel={true} />;
export const negativeLabel = () => <ChangePercent value={-1.5} isLabel={true} />;
