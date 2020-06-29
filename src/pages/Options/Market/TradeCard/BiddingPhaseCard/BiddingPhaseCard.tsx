import React, { FC, memo, useState, useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { queryCache, AnyQueryKey } from 'react-query';

import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';

import { OptionsMarketInfo, OptionsTransaction, AccountMarketInfo } from 'pages/Options/types';
import { RootState } from 'ducks/types';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { getGasInfo } from 'ducks/transaction';
import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import QUERY_KEYS from 'constants/queryKeys';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS } from 'constants/events';

import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey, getAddress } from 'utils/formatters';
import { normalizeGasLimit } from 'utils/transactions';
import { GWEI_UNIT } from 'utils/networkUtils';

import { FlexDivRowCentered, GridDivCenteredCol } from 'shared/commonStyles';

import Card from 'components/Card';
import { Button } from 'components/Button';
import { formLabelSmallCSS } from 'components/Typography/Form';

import NetworkFees from 'pages/Options/components/NetworkFees';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import snxJSConnector from 'utils/snxJSConnector';

import {
	StyledTimeRemaining,
	CardContent,
	ActionButton,
	StyledCardBody,
	PhaseEnd,
} from '../common';

import TradeSide from './TradeSide';

const mapStateToProps = (state: RootState) => ({
	walletBalancesMap: getWalletBalancesMap(state),
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
	gasInfo: getGasInfo(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type BiddingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
	accountMarketInfo: AccountMarketInfo;
};

const BiddingPhaseCard: FC<BiddingPhaseCardProps> = memo(
	({
		optionsMarket,
		isLoggedIn,
		walletBalancesMap,
		currentWalletAddress,
		gasInfo,
		accountMarketInfo,
	}) => {
		const { t } = useTranslation();
		const BOMContract = useBOMContractContext();
		const [gasLimit, setGasLimit] = useState<number | null>(null);
		const [hasAllowance, setAllowance] = useState<boolean>(false);
		const [isAllowing, setIsAllowing] = useState<boolean>(false);
		const [type, setType] = useState<OptionsTransaction['type']>('bid');
		const [isBidding, setIsBidding] = useState<boolean>(false);
		const [longSideAmount, setLongSideAmount] = useState<OptionsTransaction['amount'] | string>('');
		const [shortSideAmount, setShortSideAmount] = useState<OptionsTransaction['amount'] | string>(
			''
		);
		const [longPriceAmount, setLongPriceAmount] = useState<string | number>('');
		const [shortPriceAmount, setShortPriceAmount] = useState<string | number>('');

		const [side, setSide] = useState<OptionsTransaction['side']>('long');
		const { bids, claimable } = accountMarketInfo;
		const longPosition = {
			bid: bids.long,
			payout: claimable.long,
		};
		const shortPosition = {
			bid: bids.short,
			payout: claimable.short,
		};

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

		useEffect(() => {
			const fetchGasLimit = async (isShort: boolean, amount: string) => {
				const {
					utils: { parseEther },
				} = snxJSConnector as any;
				try {
					const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
					const bidOrRefundFunction =
						type === 'bid'
							? BOMContractWithSigner.estimate.bid
							: BOMContractWithSigner.estimate.refund;
					const gasEstimate = await bidOrRefundFunction(
						isShort ? 1 : 0,
						parseEther(amount.toString())
					);
					setGasLimit(normalizeGasLimit(Number(gasEstimate)));
				} catch (e) {
					console.log(e);
					setGasLimit(null);
				}
			};
			if (!isLoggedIn || (!shortSideAmount && !longSideAmount)) return;
			const isShort = side === 'short';
			const amount = isShort ? shortSideAmount : longSideAmount;
			fetchGasLimit(isShort, amount as string);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isLoggedIn, shortSideAmount, longSideAmount]);

		useEffect(() => {
			const {
				snxJS: { sUSD },
			} = snxJSConnector as any;

			const getAllowance = async () => {
				const allowance = await sUSD.allowance(currentWalletAddress, BOMContract.address);
				setAllowance(!!Number(allowance));
			};

			const registerAllowanceListener = () => {
				sUSD.contract.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
					if (owner === currentWalletAddress && spender === getAddress(BOMContract.address)) {
						setAllowance(true);
						setIsAllowing(false);
					}
				});
			};

			if (!currentWalletAddress) return;
			getAllowance();
			registerAllowanceListener();
			return () => {
				sUSD.contract.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [currentWalletAddress]);

		const handleAllowance = async () => {
			const {
				snxJS: { sUSD },
			} = snxJSConnector as any;
			try {
				setIsAllowing(true);
				const maxInt = `0x${'f'.repeat(64)}`;
				await sUSD.approve(BOMContract.address, maxInt);
			} catch (e) {
				console.log(e);
				setIsAllowing(false);
			}
		};

		const handleBidOrRefund = async () => {
			const {
				utils: { parseEther },
			} = snxJSConnector as any;
			const isShort = side === 'short';
			const amount = isShort ? shortSideAmount : longSideAmount;
			if (!amount) return;
			try {
				setIsBidding(true);
				const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
				const bidOrRefundFunction =
					type === 'bid' ? BOMContractWithSigner.bid : BOMContractWithSigner.refund;
				await bidOrRefundFunction(isShort ? 1 : 0, parseEther(amount.toString()), {
					gasLimit,
					gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				});
				setIsBidding(false);
			} catch (e) {
				console.log(e);
				setIsBidding(false);
			}
		};

		const handleTargetPrice = async (
			targetPrice: string,
			isShort: boolean,
			targetShort: boolean,
			isRefund: boolean
		) => {
			const {
				utils: { parseEther },
			} = snxJSConnector as any;
			const setPriceAmountFunction = isShort ? setShortPriceAmount : setLongPriceAmount;
			const setSideAmountFunction = isShort ? setShortSideAmount : setLongSideAmount;
			try {
				if (!targetPrice) {
					setPriceAmountFunction('');
					return;
				}
				setPriceAmountFunction(targetPrice);
				const amountNeeded = await BOMContract.bidOrRefundForPrice(
					isShort ? 1 : 0,
					targetShort ? 1 : 0,
					parseEther(targetPrice),
					isRefund
				);
				setSideAmountFunction(amountNeeded / 1e18);
			} catch (e) {
				console.log(e);
				setPriceAmountFunction('');
			}
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
							onPriceChange={(e) =>
								handleTargetPrice(e.target.value, false, false, type === 'refund')
							}
							onClick={() => setSide('long')}
							transKey={transKey}
							currentPosition={longPosition}
						/>
						<TradeSideSeparator />
						<TradeSide
							side="short"
							type={type}
							isActive={side === 'short'}
							amount={shortSideAmount}
							onAmountChange={(e) => setShortSideAmount(e.target.value)}
							price={shortPriceAmount}
							onPriceChange={(e) =>
								handleTargetPrice(e.target.value, true, true, type === 'refund')
							}
							onClick={() => setSide('short')}
							transKey={transKey}
							currentPosition={shortPosition}
						/>
					</TradeSides>
					<CardContent>
						<NetworkFees gasLimit={gasLimit} />
						{hasAllowance ? (
							<ActionButton
								size="lg"
								palette="primary"
								disabled={isBidding || !isLoggedIn || !sUSDBalance || !gasLimit}
								onClick={handleBidOrRefund}
							>
								{!isBidding
									? t(`${transKey}.confirm-button.label`)
									: t(`${transKey}.confirm-button.progress-label`)}
							</ActionButton>
						) : (
							<ActionButton
								size="lg"
								palette="primary"
								disabled={isAllowing || !isLoggedIn}
								onClick={handleAllowance}
							>
								{!isAllowing
									? t(`${transKey}.allowance-button.label`)
									: t(`${transKey}.allowance-button.progress-label`)}
							</ActionButton>
						)}
						<PhaseEnd>
							{t('options.market.trade-card.bidding.footer.end-label')}{' '}
							<StyledTimeRemaining
								end={optionsMarket.timeRemaining}
								onEnded={() =>
									queryCache.invalidateQueries(
										(QUERY_KEYS.BinaryOptions.Market(
											optionsMarket.address
										) as unknown) as AnyQueryKey
									)
								}
							/>
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

export const TabButton = styled(Button).attrs({ size: 'sm', palette: 'tab' })``;

const WalletBalance = styled(GridDivCenteredCol)`
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 12px;
	grid-gap: 8px;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const Title = styled.div`
	${formLabelSmallCSS};
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

export default connector(BiddingPhaseCard);
