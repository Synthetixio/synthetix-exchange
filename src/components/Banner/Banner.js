import React from 'react';
import styled from 'styled-components';

import { FlexDivCentered, ExternalLink } from '../../shared/commonStyles';

const Banner = () => (
	<Wrapper>
		Ether Collateral loans have been paused please see
		<Link href="http://blog.synthetix.io/bug-disclosure/">this post</Link>
		for more details.
	</Wrapper>
);

const Link = styled(ExternalLink)`
	color: ${props => props.theme.colors.white};
	margin: 0 5px;
	text-decoration: underline;
	&:hover {
		text-decoration: underline;
	}
`;

const Wrapper = styled(FlexDivCentered)`
	background-color: ${props => props.theme.colors.buttonDefault};
	color: ${props => props.theme.colors.white};
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	letter-spacing: 0.5px;
	font-size: 14px;
	text-transform: uppercase;
	width: 100%;
`;

export default Banner;
