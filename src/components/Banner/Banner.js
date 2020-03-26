import React from 'react';
import styled from 'styled-components';

import { FlexDivCentered } from '../../shared/commonStyles';
import Link from 'src/components/Link';

const ETHER_COLLATERAL_BLOG_POST_LINK = 'http://blog.synthetix.io/bug-disclosure/';

const Banner = () => (
	<Wrapper>
		Ether Collateral loans have been paused please see
		<StyledLink to={ETHER_COLLATERAL_BLOG_POST_LINK} isExternal={true}>
			this post
		</StyledLink>
		for more details.
	</Wrapper>
);

const StyledLink = styled(Link)`
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
