import React from 'react';

import Card from './Card';
import { HeadingSmall, DataMedium } from '../Typography';

export default {
	title: 'Card',
};

export const card = () => (
	<Card>
		<Card.Header>
			<HeadingSmall>Card Header</HeadingSmall>
		</Card.Header>
		<Card.Body>
			<DataMedium>Card Body</DataMedium>
		</Card.Body>
	</Card>
);
