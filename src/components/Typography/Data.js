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
	font-family: 'apercu-regular', sans-serif;
`;

export const dataSmallCSS = css`
	${dataCSS};
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-family: 'apercu-medium', sans-serif;
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
