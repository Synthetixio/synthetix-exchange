import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { bodyCSS } from 'components/Typography/General';
import { dataLargeCSS } from 'components/Typography/Data';
import { headingH3CSS } from 'components/Typography/Heading';
import Link from 'components/Link';

import { ReactComponent as BorrowsETHIcon } from 'assets/images/splash/borrow-sETH.svg';
import { ReactComponent as BuysETHIcon } from 'assets/images/splash/buy-sETH.svg';
import { ReactComponent as BuysUSDIcon } from 'assets/images/splash/buy-sUSD.svg';

import { lightTheme } from 'styles/theme';

import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP } from 'constants/currency';

import { ROUTES } from 'constants/routes';
import { LINKS } from 'constants/links';

import { media } from 'shared/media';

import { shiftUpHoverEffectCSS } from 'shared/commonStyles';

export const NewUserPromo = () => {
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
};

const Container = styled.div`
	padding: 85px 20px;
	background-color: ${lightTheme.colors.surfaceL2};
	width: 100%;
	text-align: center;
	${media.medium`
		padding: 70px 30px 100px;
	`}
`;

const Title = styled.div`
	${headingH3CSS};
	color: ${lightTheme.colors.brand};
	margin-bottom: 16px;
`;

const Subtitle = styled.span`
	${bodyCSS};
	font-size: 18px;
	color: ${lightTheme.colors.fontPrimary};
`;

const PromoCards = styled.div`
	display: grid;
	grid-gap: 40px;
	margin-top: 56px;
	grid-template-columns: repeat(3, minmax(205px, 280px));
	justify-content: center;
	${media.small`
		grid-template-columns: minmax(205px, 280px);
	`}
`;

const PromoCard = styled.div`
	display: grid;
	grid-gap: 24px;
	padding: 24px;
	background-color: ${lightTheme.colors.surfaceL3};
	border: 1px solid ${lightTheme.colors.accentL2};
	box-shadow: 0px 4px 11px rgba(209, 209, 232, 0.25);
	border-radius: 2px;
	box-sizing: border-box;
	height: 180px;
	grid-template-rows: 1fr auto;
	justify-items: center;
	${shiftUpHoverEffectCSS};
`;

const PromoCardLabel = styled.span`
	${dataLargeCSS};
	text-transform: none;
	color: ${lightTheme.colors.fontPrimary};
`;

export default NewUserPromo;
