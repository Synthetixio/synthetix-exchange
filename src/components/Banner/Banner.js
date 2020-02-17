import React from 'react';
import styled from 'styled-components';

const Banner = () => {
	return (
		<Wrapper>
			Please note the trading fee has been temporarily increased to 2% (or 4% for long Synths to
			short Synths){' '}
			<Link
				target="_blank"
				href="https://blog.synthetix.io/planning-for-before-and-after-achernar/"
			>
				See blog post
			</Link>
		</Wrapper>
	);
};

const Link = styled.a`
	color: #fff;
	margin-left: 10px;
`;

const Wrapper = styled.div`
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
