import React, { FC, memo, useState, useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';

import { OptionsMarket, OptionsTransaction } from 'ducks/options/types';
import { RootState } from 'ducks/types';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';

import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey } from 'utils/formatters';

import { FlexDivRowCentered, GridDivCenteredCol } from 'shared/commonStyles';

import Card from 'components/Card';
import { Button } from 'components/Button';
import { formLabelSmallCSS } from 'components/Typography/Form';
import TimeRemaining from 'pages/Options/Home/components/TimeRemaining';

import TradeSide from './TradeSide';

import { CurrentPosition } from './types';

const mapStateToProps = (state: RootState) => ({
	walletBalancesMap: getWalletBalancesMap(state),
	isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type BiddingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarket;
};

const BiddingPhaseCard: FC<BiddingPhaseCardProps> = memo(
	({ optionsMarket, isLoggedIn, walletBalancesMap }) => {
		const { t } = useTranslation();
		const [type, setType] = useState<OptionsTransaction['type']>('bid');
		const [isBidding, setIsBidding] = useState<boolean>(false);
		const [longSideAmount, setLongSideAmount] = useState<OptionsTransaction['amount']>('');
		const [shortSideAmount, setShortSideAmount] = useState<OptionsTransaction['amount']>('');
		const [longPriceAmount, setLongPriceAmount] = useState<string | number>('');
		const [shortPriceAmount, setShortPriceAmount] = useState<string | number>('');
		const [shortCurrentPosition, setShortCurrentPosition] = useState<CurrentPosition>({
			bid: 0,
			payoff: 0,
		});
		const [longCurrentPosition, setLongCurrentPosition] = useState<CurrentPosition>({
			bid: 0,
			payoff: 0,
		});

		const [side, setSide] = useState<OptionsTransaction['side']>('long');

		useEffect(() => {
			setLongSideAmount('');
			setShortSideAmount('');
			setLongPriceAmount('');
			setShortPriceAmount('');
		}, [side]);

		const transKey =
			type === 'bid'
				? 'options.market.trade-card.bidding.bid'
				: 'options.market.trade-card.bidding.refund';

		const handleBidding = () => {
			console.log('TODO');
			setIsBidding(true);
		};

		const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD);

		return (
			<Card>
				<StyledCardHeader>
					<TabButton isActive={type === 'bid'} onClick={() => setType('bid')}>
						{t('options.market.trade-card.bidding.bid.title')}
					</TabButton>
					<TabButton isActive={type === 'refund'} onClick={() => setType('refund')}>
						{t('options.market.trade-card.bidding.refund.title')}
					</TabButton>
				</StyledCardHeader>
				<StyledCardBody>
					<CardContent>
						<FlexDivRowCentered>
							<Title>{t(`${transKey}.title`)}</Title>
							<WalletBalance>
								<WalletIcon />
								{isLoggedIn ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance) : EMPTY_VALUE}
							</WalletBalance>
						</FlexDivRowCentered>
					</CardContent>
					<TradeSides>
						<TradeSide
							side="long"
							type={type}
							isActive={side === 'long'}
							amount={longSideAmount}
							onAmountChange={(e) => setLongSideAmount(e.target.value)}
							price={longPriceAmount}
							onPriceChange={(e) => setLongPriceAmount(e.target.value)}
							onClick={() => setSide('long')}
							transKey={transKey}
							currentPosition={shortCurrentPosition}
						/>
						<TradeSideSeparator />
						<TradeSide
							side="short"
							type={type}
							isActive={side === 'short'}
							amount={shortSideAmount}
							onAmountChange={(e) => setShortSideAmount(e.target.value)}
							price={shortPriceAmount}
							onPriceChange={(e) => setShortPriceAmount(e.target.value)}
							onClick={() => setSide('short')}
							transKey={transKey}
							currentPosition={longCurrentPosition}
						/>
					</TradeSides>
					<CardContent>
						<ActionButton
							size="lg"
							palette="primary"
							disabled={isBidding || !isLoggedIn || !sUSDBalance}
							onClick={handleBidding}
						>
							{!isBidding
								? t(`${transKey}.confirm-button.label`)
								: t(`${transKey}.confirm-button.progress-label`)}
						</ActionButton>
						<PhaseEnd>
							{t('options.market.trade-card.bidding.footer.end-label')}{' '}
							<StyledTimeRemaining end={optionsMarket.endOfBidding} />
						</PhaseEnd>
					</CardContent>
				</StyledCardBody>
			</Card>
		);
	}
);

const StyledCardHeader = styled(Card.Header)`
	padding: 0;
	> * + * {
		margin-left: 0;
	}
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 4px;
	grid-gap: 4px;
`;

const CardContent = styled.div`
	padding: 12px;
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
	&:last-child {
		border-bottom: 0;
	}
`;

export const TabButton = styled(Button).attrs({ size: 'sm', palette: 'tab' })``;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

const WalletBalance = styled(GridDivCenteredCol)`
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 12px;
	grid-gap: 8px;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const Title = styled.div`
	${formLabelSmallCSS};
`;

const ActionButton = styled(Button)`
	width: 100%;
`;

const TradeSides = styled(GridDivCenteredCol)`
	grid-auto-flow: initial;
	grid-template-columns: 1fr auto 1fr;
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
`;

const TradeSideSeparator = styled.div`
	width: 1px;
	height: 100%;
	background-color: ${(props) => props.theme.colors.accentL1};
`;

const PhaseEnd = styled.div`
	font-size: 12px;
	text-transform: uppercase;
	text-align: center;
	padding-top: 12px;
`;
const StyledTimeRemaining = styled(TimeRemaining)`
	background: none;
	font-size: 12px;
	padding: 0;
	display: inline;
`;

export default connector(BiddingPhaseCard);
