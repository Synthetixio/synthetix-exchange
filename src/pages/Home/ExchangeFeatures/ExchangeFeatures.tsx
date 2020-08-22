import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { headingH3CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';
import { dataLargeCSS, dataMediumCSS } from 'components/Typography/Data';
import { ButtonPrimary } from 'components/Button';

import { ReactComponent as LiquidityIcon } from 'assets/images/splash/liquidity.svg';
import { ReactComponent as PeerToContractIcon } from 'assets/images/splash/peer-to-contract.svg';
import { ReactComponent as DistributedIcon } from 'assets/images/splash/distributed.svg';

import { ROUTES, navigateTo } from 'constants/routes';

import { darkTheme } from 'styles/theme';

import { media } from 'shared/media';

export const ExchangeFeatures = () => {
	const { t } = useTranslation();

	return (
		<Container>
			<Title>{t('home.exchange-features.title')}</Title>
			<Subtitle>{t('home.exchange-features.subtitle')}</Subtitle>
			<FeatureCards>
				<FeatureCard>
					<Icon>
						<LiquidityIcon />
					</Icon>
					<FeatureCardTitle>
						{t('home.exchange-features.features.infinite-liquidity.title')}
					</FeatureCardTitle>
					<FeatureCardDesc>
						{t('home.exchange-features.features.infinite-liquidity.desc')}
					</FeatureCardDesc>
				</FeatureCard>
				<FeatureCard>
					<Icon>
						<PeerToContractIcon />
					</Icon>
					<FeatureCardTitle>
						{t('home.exchange-features.features.peer-to-contract.title')}
					</FeatureCardTitle>
					<FeatureCardDesc>
						{t('home.exchange-features.features.peer-to-contract.desc')}
					</FeatureCardDesc>
				</FeatureCard>
				<FeatureCard>
					<Icon>
						<DistributedIcon />
					</Icon>
					<FeatureCardTitle>
						{t('home.exchange-features.features.distributed-collateral-pool.title')}
					</FeatureCardTitle>
					<FeatureCardDesc>
						{t('home.exchange-features.features.distributed-collateral-pool.desc')}
					</FeatureCardDesc>
				</FeatureCard>
			</FeatureCards>
			<StyledButtonPrimary onClick={() => navigateTo(ROUTES.Trade)}>
				{t('home.exchange-features.start-trading-button')}
			</StyledButtonPrimary>
		</Container>
	);
};

const Container = styled.div`
	padding: 120px 20px;
	background-color: ${darkTheme.colors.surfaceL2};
	width: 100%;
	text-align: center;
	${media.medium`
		padding: 80px 20px;
	`}
`;

const Title = styled.div`
	${headingH3CSS};
	color: ${darkTheme.colors.brand};
	margin-bottom: 16px;
`;

const Subtitle = styled.span`
	${bodyCSS};
	font-size: 18px;
	color: ${darkTheme.colors.fontSecondary};
`;

const FeatureCards = styled.div`
	display: grid;
	grid-gap: 40px;
	margin-top: 76px;
	margin-bottom: 93px;
	grid-template-columns: repeat(3, minmax(205px, 320px));
	justify-content: center;
	${media.medium`
		grid-template-columns: minmax(205px, 320px);
	`}
`;

const FeatureCard = styled.div`
	display: grid;
	box-sizing: border-box;
	border-radius: 2px;
	justify-content: center;
`;

const Icon = styled.div`
	margin: 0 auto;
	padding-bottom: 32px;
`;

const FeatureCardTitle = styled.span`
	${dataLargeCSS};
	color: ${darkTheme.colors.fontPrimary};
	padding-bottom: 16px;
`;

const FeatureCardDesc = styled.span`
	${dataMediumCSS};
	text-transform: none;
	color: ${darkTheme.colors.fontSecondary};
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
	width: auto;
	padding: 0 80px;
`;

export default ExchangeFeatures;
