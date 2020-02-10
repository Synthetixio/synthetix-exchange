import React from 'react';
import styled from 'styled-components';

import { text, select } from '@storybook/addon-knobs';
import { Typography } from './Typography';

export default {
	title: 'Typography/Typography',
};

const variants = {
	Heading: 'heading',
	Data: 'data',
	Body: 'body',
	Label: 'label',
};

const sizes = {
	Large: 'lg',
	Medium: 'md',
	Small: 'sm',
};

export const Playground = () => (
	<Typography variant={select('variant', variants)} size={select('size', sizes)}>
		{text('Text', 'Lorem ipsum')}
	</Typography>
);

export const StyledTypography = () => {
	const StyledTypography = styled(Typography)`
		color: red;
	`;

	return (
		<StyledTypography variant={select('variant', variants)} size={select('size', sizes)}>
			{text('Text', 'Lorem ipsum')}
		</StyledTypography>
	);
};
