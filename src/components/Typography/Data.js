import styled, { css } from 'styled-components';
import { color, typography } from 'styled-system';

const dataCSS = css`
	color: ${props => props.theme.colors.fontPrimary};
`;

export const dataLargeCSS = css`
	${dataCSS};
	font-size: 18px;
	text-transform: uppercase;
`;

export const dataMediumCSS = css`
	${dataCSS};
	font-size: 14px;
	font-family: ${props => props.theme.fonts.regular};
`;

export const dataSmallCSS = css`
	${dataCSS};
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-family: ${props => props.theme.fonts.medium};
`;

export const DataLarge = styled.span`
	${dataLargeCSS};
	${typography}
`;

export const DataMedium = styled.span`
	${dataMediumCSS};
	${typography};
	${color};
`;

export const DataSmall = styled.span`
	${dataSmallCSS};
	${color};
	${typography};
`;

export const chartDataCSS = css`
	font-family: ${props => props.theme.fonts.regular};
	font-size: 10px;
	line-height: 12px;
	letter-spacing: 0.2px;
`;

export const tableDataSmallCSS = css`
	font-family: ${props => props.theme.fonts.regular};
	font-size: 12px;
	line-height: 15px;
	letter-spacing: 0.2px;
	padding: 18px;
`;
