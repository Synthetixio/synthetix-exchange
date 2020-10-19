import styled, { css } from 'styled-components';

interface MarginProps {
	top?: string;
	left?: string;
	bottom?: string;
	right?: string;
	all?: string;
	leftRight?: string;
	topBottom?: string;
}

interface CalculatedMargin {
	top?: string;
	left?: string;
	bottom?: string;
	right?: string;
}

function computeMargin(props: MarginProps): CalculatedMargin {
	const top = props.top ?? props.topBottom ?? props.all;
	const left = props.left ?? props.leftRight ?? props.all;
	const bottom = props.bottom ?? props.topBottom ?? props.all;
	const right = props.right ?? props.leftRight ?? props.all;
	return {
		top,
		left,
		bottom,
		right,
	};
}

const Margin = styled.div<MarginProps>`
	${(p) => {
		const { top, left, bottom, right } = computeMargin(p);

		if (top != null && bottom === top && left != null && right === left && top === left) {
			return css`
				margin: ${top};
			`;
		}

		if (top != null && bottom === top && left != null && right === left) {
			return css`
				margin: ${top} ${left};
			`;
		}

		if (top != null && bottom != null && left != null && right != null) {
			return css`
				margin: ${top} ${right} ${bottom} ${left};
			`;
		}
		return css`
			${top != null
				? css`
						margin-top: ${top};
				  `
				: css``}
			${left != null
				? css`
						margin-left: ${left};
				  `
				: css``}
      ${right != null
				? css`
						margin-right: ${right};
				  `
				: css``}
      ${bottom != null
				? css`
						margin-bottom: ${bottom};
				  `
				: css``}
		`;
	}}
`;

export default Margin;
