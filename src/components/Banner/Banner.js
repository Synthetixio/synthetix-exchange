import React from 'react';
import styled from 'styled-components';

import { FlexDivCentered, ExternalLink } from '../../shared/commonStyles';

const Banner = () => (
	<Wrapper>
		Please note the trading fee has been temporarily increased to 2% (or 4% for long Synths to short
		Synths){' '}
		<Link href="https://blog.synthetix.io/planning-for-before-and-after-achernar/">
			See blog post
		</Link>
	</Wrapper>
);

const Link = styled(ExternalLink)`
	color: ${props => props.theme.colors.white};
	margin-left: 10px;
	text-decoration: underline;
	&:hover {
		text-decoration: underline;
	}
`;

const Wrapper = styled(FlexDivCentered)`
	background-color: ${props => props.theme.colors.buttonDefault};
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	letter-spacing: 0.5px;
	font-size: 14px;
	text-transform: uppercase;
`;

export default Banner;
