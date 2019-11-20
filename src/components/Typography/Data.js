import React from 'react';
import styled from 'styled-components';

// import { pxToRem } from '../../styles';

export const DataLarge = ({ children, weight }) => {
	return <DataLargeElement weight={weight}>{children}</DataLargeElement>;
};

export const DataMedium = ({ children, weight }) => {
	return <DataMediumElement weight={weight}>{children}</DataMediumElement>;
};

export const DataSmall = ({ children, weight }) => {
	return <DataSmallElement weight={weight}>{children}</DataSmallElement>;
};

const DataLargeElement = styled.span`
	font-size: 12px;
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontPrimary};
`;
const DataMediumElement = styled.span`
	font-size: 14px;
	color: ${props => props.theme.colors.fontPrimary};
`;
const DataSmallElement = styled.span`
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: ${props => props.theme.colors.fontPrimary};
`;
