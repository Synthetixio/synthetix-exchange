import React, { memo } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ButtonPrimary } from 'src/components/Button';
import Link from 'src/components/Link';

import { ResponsiveContainer, LineChart, Line } from 'recharts';

import { showTwitterPopup } from 'src/ducks/ui';

const data = [
	{ price: 10 },
	{ price: 11 },
	{ price: 12 },
	{ price: 15 },
	{ price: 18 },
	{ price: 20 },
	{ price: 25 },
	{ price: 26 },
	{ price: 45 },
	{ price: 42 },
	{ price: 41 },
	{ price: 35 },
	{ price: 39 },
	{ price: 40 },
	{ price: 41 },
	{ price: 45 },
	{ price: 50 },
	{ price: 51 },
	{ price: 55 },
	{ price: 58 },
];

const NewUser = memo(({ showTwitterPopup }) => (
	<>
		<Hero>
			<Welcome>Welcome to</Welcome>
			<Heading>Synthetix.Exchange</Heading>
			<Subtitle>
				An L2 testnet trading competition powered by the{' '}
				<Link to="https://optimism.io/ovm/" isExternal={true}>
					OVM
				</Link>
				. Experience the speed of optimistic rollups.
			</Subtitle>
			<ButtonPrimary size="lg" style={{ width: '300px' }} onClick={showTwitterPopup}>
				GET YOUR TOKENS NOW
			</ButtonPrimary>
		</Hero>
		<ResponsiveContainer width="100%" height={200}>
			<LineChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
				<Line
					dataKey="price"
					stroke="#00E2DF"
					fill="url(#splashChartArea)"
					dot={false}
					activeDot={false}
				/>
			</LineChart>
		</ResponsiveContainer>
	</>
));

const Hero = styled.div`
	text-align: center;
	padding: 0 30px 30px 30px;
`;

const Welcome = styled.div`
	font-size: 20px;
	line-height: 25px;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	background: -webkit-linear-gradient(167.03deg, #f4c625 -8.54%, #e652e9 101.04%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	padding-bottom: 12px;
`;

const Heading = styled.div`
	font-family: ${props => props.theme.fonts.medium};
	font-size: 56px;
	line-height: 70px;
	text-align: center;
	letter-spacing: 0.2px;
	text-shadow: 0px 0px 10px #b47598;
	padding-bottom: 12px;
	text-transform: uppercase;
`;

const Subtitle = styled.div`
	font-size: 24px;
	padding-bottom: 58px;
	max-width: 650px;
	margin: 0 auto;
	color: ${props => props.theme.colors.fontSecondary};
	font-weight: normal;
	a {
		text-decoration: underline;
		color: ${props => props.theme.colors.fontSecondary};
		&:hover {
			text-decoration: underline;
		}
	}
`;

const mapDispatchToProps = {
	showTwitterPopup,
};

export default connect(null, mapDispatchToProps)(NewUser);
