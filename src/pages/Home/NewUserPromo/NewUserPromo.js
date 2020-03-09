import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { HeadingMedium, BodyLarge } from 'src/components/Typography';
import { dataLargeCSS } from 'src/components/Typography/Data';
import Link from 'src/components/Link';

import { ReactComponent as BorrowsETHIcon } from 'src/assets/images/splash/borrow-sETH.svg';
import { ReactComponent as BuysETHIcon } from 'src/assets/images/splash/buy-sETH.svg';
import { ReactComponent as BuysUSDIcon } from 'src/assets/images/splash/buy-sUSD.svg';

import { lightTheme } from 'src/styles/theme';

import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP } from 'src/constants/currency';

import { ROUTES } from 'src/constants/routes';
import { LINKS } from 'src/constants/links';

import { media } from 'src/shared/media';

export const NewUserPromo = memo(() => {
	const { t } = useTranslation();

	return (
		<Container>
			<Title>{t('home.new-user-promo.title')}</Title>
			<Subtitle>{t('home.new-user-promo.subtitle')}</Subtitle>
			<PromoCards>
				<Link to={LINKS.Trading.DexAG} isExternal={true}>
					<PromoCard>
						<BuysETHIcon />
						<PromoCardLabel>
							{t('common.currency.buy-currencyA-with-currencyB', {
								currencyKeyA: SYNTHS_MAP.sETH,
								currencyKeyB: CRYPTO_CURRENCY_MAP.ETH,
							})}
						</PromoCardLabel>
					</PromoCard>
				</Link>
				<Link to={LINKS.Trading.DexAG} isExternal={true}>
					<PromoCard>
						<BuysUSDIcon />
						<PromoCardLabel>
							{t('common.currency.buy-currencyA-with-currencyB', {
								currencyKeyA: SYNTHS_MAP.sUSD,
								currencyKeyB: CRYPTO_CURRENCY_MAP.ETH,
							})}
						</PromoCardLabel>
					</PromoCard>
				</Link>
				<Link to={ROUTES.Loans}>
					<PromoCard>
						<BorrowsETHIcon />
						<PromoCardLabel>
							{t('common.currency.borrow-currency', {
								currencyKey: SYNTHS_MAP.sETH,
							})}
						</PromoCardLabel>
					</PromoCard>
				</Link>
			</PromoCards>
		</Container>
	);
});

const Container = styled.div`
	padding: 85px;
	background-color: ${lightTheme.colors.surfaceL2};
	width: 100%;
	text-align: center;
	${media.medium`
		padding: 70px 30px 100px;
	`}
`;

const Title = styled(HeadingMedium)`
	color: ${lightTheme.colors.brand};
	margin-bottom: 16px;
`;

const Subtitle = styled(BodyLarge)`
	color: ${lightTheme.colors.fontPrimary};
`;

const PromoCards = styled.div`
	display: grid;
	grid-gap: 40px;
	margin-top: 56px;
	grid-template-columns: repeat(3, 280px);
	justify-content: center;
	${media.medium`
		grid-template-columns: 280px;
	`}
`;

const PromoCard = styled.div`
	display: grid;
	grid-gap: 42px;
	padding: 24px;
	background-color: ${lightTheme.colors.surfaceL3};
	border: 1px solid ${lightTheme.colors.accentLight};
	box-shadow: 0px 4px 11px rgba(209, 209, 232, 0.25);
	border-radius: 2px;
	justify-content: center;

	> * {
		margin: 0 auto;
	}
`;

const PromoCardLabel = styled.span`
	${dataLargeCSS};
	text-transform: none;
	color: ${lightTheme.colors.fontPrimary};
`;

export default NewUserPromo;
