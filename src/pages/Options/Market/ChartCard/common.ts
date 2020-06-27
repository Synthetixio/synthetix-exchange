import styled, { css } from 'styled-components';

export const ChartContainer = styled.div<{ semiTransparent: boolean }>`
	height: 300px;
	position: relative;
	${(props) =>
		props.semiTransparent &&
		css`
			opacity: 0.5;
			filter: blur(3px);
		`}

	.ref-line-label {
		font-size: 10px;
		font-family: ${(props) => props.theme.fonts.regular};
		text-transform: uppercase;
	}
	.ref-line-label-long {
		fill: ${(props) => props.theme.colors.green};
	}
	.ref-line-label-short {
		fill: ${(props) => props.theme.colors.red};
	}
	.ref-line-label-strike-price {
		fill: ${(props) => props.theme.colors.fontSecondary};
	}
`;
