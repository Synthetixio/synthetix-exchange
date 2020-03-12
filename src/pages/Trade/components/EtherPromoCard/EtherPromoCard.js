import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';

import { getWalletInfo } from '../../../../ducks';

import history from '../../../../utils/history';

import { ROUTES } from '../../../../constants/routes';
import { LINKS } from '../../../../constants/links';

import { ExternalLink, CurrencyKey } from '../../../../shared/commonStyles';

import Card from '../../../../components/Card';
import { ButtonPrimary } from '../../../../components/Button';
import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP } from '../../../../constants/currency';
import { getCurrencyKeyBalance } from '../../../../utils/balances';

const ETH_CURRENCY_KEY = CRYPTO_CURRENCY_MAP.ETH;

export const EtherPromoCard = ({ walletInfo: { balances, currentWallet } }) => {
	const { t } = useTranslation();

	const ETHCurrencyBalance = getCurrencyKeyBalance(balances, ETH_CURRENCY_KEY);

	const shouldShowPromoCard = currentWallet != null && ETHCurrencyBalance > 0;

	return (
		<EtherPromo>
			{/* TODO: This is temporary - we need to move the shadow to sit in a parent component */}
			<Shadow />
			{shouldShowPromoCard && (
				<Card>
					<PromoCardHeader>{t('trade.promo.ether-promo-card.title')}</PromoCardHeader>
					<Card.Body>
						<ExternalLinksRow>
							<ExternalLink href={LINKS.Trading.DexAG}>
								<StyledButton>
									<Trans
										i18nKey="common.currency.buy-currencyA-with-currencyB"
										values={{ currencyKeyA: SYNTHS_MAP.sUSD, currencyKeyB: ETH_CURRENCY_KEY }}
										components={[<CurrencyKey />]}
									/>
								</StyledButton>
							</ExternalLink>
							<ExternalLink href={LINKS.Trading.DexAG}>
								<StyledButton>
									<Trans
										i18nKey="common.currency.buy-currencyA-with-currencyB"
										values={{ currencyKeyA: SYNTHS_MAP.sETH, currencyKeyB: ETH_CURRENCY_KEY }}
										components={[<CurrencyKey />]}
									/>
								</StyledButton>
							</ExternalLink>
						</ExternalLinksRow>
						<StyledButton onClick={() => history.push(ROUTES.Loans)}>
							<Trans
								i18nKey="common.currency.borrow-currency"
								values={{ currencyKey: SYNTHS_MAP.sETH }}
								components={[<CurrencyKey />]}
							/>
						</StyledButton>
					</Card.Body>
				</Card>
			)}
		</EtherPromo>
	);
};

EtherPromoCard.propTypes = {
	walletInfo: PropTypes.object.isRequired,
};

const StyledButton = styled(ButtonPrimary).attrs({ size: 'sm' })`
	width: 100%;
	text-transform: none;
`;

const ExternalLinksRow = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-gap: 15px;
	margin-bottom: 15px;
`;

const EtherPromo = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
`;

const Shadow = styled.div`
	background-image: ${props =>
		props.theme.isDarkTheme
			? `linear-gradient(180deg, rgba(20, 19, 30, 0) 50%, rgba(14, 13, 20, 1) 100%)`
			: `linear-gradient(180deg, rgba(247, 248, 251, 0) 49.97%, #F8F9FC 100%)`};
	width: 100%;
	height: 67px;
`;

const PromoCardHeader = styled(Card.Header)`
	justify-content: center;
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
});

export default connect(mapStateToProps, null)(EtherPromoCard);
