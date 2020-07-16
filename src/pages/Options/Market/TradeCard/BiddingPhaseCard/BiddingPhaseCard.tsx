import React, { FC, useState, useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { queryCache, AnyQueryKey } from 'react-query';

import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';

import { OptionsTransaction, TradeCardPhaseProps } from 'pages/Options/types';
import { RootState } from 'ducks/types';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { getGasInfo } from 'ducks/transaction';
import { getIsWalletConnected, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import {
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
} from 'ducks/options/pendingTransaction';

import QUERY_KEYS from 'constants/queryKeys';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS } from 'constants/events';
import { SLIPPAGE_THRESHOLD } from 'constants/ui';

import { getCurrencyKeyBalance, getCurrencyKeyUSDBalanceBN } from 'utils/balances';
import { formatCurrencyWithKey, getAddress } from 'utils/formatters';
import { normalizeGasLimit } from 'utils/transactions';
import { GWEI_UNIT } from 'utils/networkUtils';

import { FlexDivRowCentered, GridDivCenteredCol } from 'shared/commonStyles';

import Card from 'components/Card';
import { Button } from 'components/Button';
import { formLabelSmallCSS } from 'components/Typography/Form';

import BidNetworkFees from '../components/BidNetworkFees';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import snxJSConnector from 'utils/snxJSConnector';

// TO DO: rename and put this tooltip in ./components
import NetworkInfoTooltip from 'pages/Trade/components/CreateOrderCard/NetworkInfoTooltip';

import {
	StyledTimeRemaining,
	CardContent,
	ActionButton,
	StyledCardBody,
	PhaseEnd,
} from '../common';

import TradeSide from './TradeSide';
import { ethers } from 'ethers';

const TIMEOUT_DELAY = 2500;

const mapStateToProps = (state: RootState) => ({
	walletBalancesMap: getWalletBalancesMap(state),
	isWalletConnected: getIsWalletConnected(state),
	currentWalletAddress: getCurrentWalletAddress(state),
	gasInfo: getGasInfo(state),
});

const mapDispatchToProps = {
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type BiddingPhaseCardProps = PropsFromRedux & TradeCardPhaseProps;

function getPriceDifference(currentPrice: number, newPrice: number) {
	return newPrice - currentPrice;
}

const BiddingPhaseCard: FC<BiddingPhaseCardProps> = ({
	optionsMarket,
	isWalletConnected,
	walletBalancesMap,
	currentWalletAddress,
	gasInfo,
	accountMarketInfo,
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
}) => {
	const { longPrice, shortPrice, fees, isResolved, BN } = optionsMarket;
	const { t } = useTranslation();
	const BOMContract = useBOMContractContext();
	const [gasLimit, setGasLimit] = useState<number | null>(null);
	const [hasAllowance, setAllowance] = useState<boolean>(false);
	const [isAllowing, setIsAllowing] = useState<boolean>(false);
	const [type, setType] = useState<OptionsTransaction['type']>('bid');
	const [isBidding, setIsBidding] = useState<boolean>(false);
	const [priceShift, setPriceShift] = useState<number>(0);
	const [longSideAmount, setLongSideAmount] = useState<OptionsTransaction['amount'] | string>('');
	const [shortSideAmount, setShortSideAmount] = useState<OptionsTransaction['amount'] | string>('');
	const [longPriceAmount, setLongPriceAmount] = useState<string | number>('');
	const [shortPriceAmount, setShortPriceAmount] = useState<string | number>('');

	const [side, setSide] = useState<OptionsTransaction['side']>('long');

	const [pricesAfterBidOrRefundTimer, setPricesAfterBidOrRefundTimer] = useState<number | null>(
		null
	);
	const [bidOrRefundForPriceTimer, setBidOrRefundForPriceTimer] = useState<number | null>(null);

	const { bids, claimable } = accountMarketInfo;
	const longPosition = {
		bid: bids.long,
		payout: claimable.long,
	};
	const shortPosition = {
		bid: bids.short,
		payout: claimable.short,
	};
	const isRefund = type === 'refund';
	const isBid = type === 'bid';
	const isLong = side === 'long';
	const isShort = side === 'short';

	useEffect(() => {
		return () => {
			if (pricesAfterBidOrRefundTimer) {
				clearTimeout(pricesAfterBidOrRefundTimer);
			}
			if (bidOrRefundForPriceTimer) {
				clearTimeout(bidOrRefundForPriceTimer);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const transKey = isBid
		? 'options.market.trade-card.bidding.bid'
		: 'options.market.trade-card.bidding.refund';

	const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
	const sUSDBalanceBN = getCurrencyKeyUSDBalanceBN(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

	useEffect(() => {
		const fetchGasLimit = async (isShort: boolean, amount: string) => {
			const {
				utils: { parseEther },
			} = snxJSConnector as any;
			try {
				const bidOrRefundAmount =
					amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());
				const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
				const bidOrRefundFunction = isBid
					? BOMContractWithSigner.estimate.bid
					: BOMContractWithSigner.estimate.refund;
				const gasEstimate = await bidOrRefundFunction(isShort ? 1 : 0, bidOrRefundAmount);
				setGasLimit(normalizeGasLimit(Number(gasEstimate)));
			} catch (e) {
				console.log(e);
				setGasLimit(null);
			}
		};
		if (!hasAllowance || !isWalletConnected || (!shortSideAmount && !longSideAmount)) return;
		const amount = isShort ? shortSideAmount : longSideAmount;
		fetchGasLimit(isShort, amount as string);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWalletConnected, shortSideAmount, longSideAmount, hasAllowance]);

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
		if (isWalletConnected) {
			getAllowance();
			registerAllowanceListener();
		}
		return () => {
			sUSD.contract.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWalletAddress, isWalletConnected]);

	const handleAllowance = async () => {
		const {
			snxJS: { sUSD },
		} = snxJSConnector as any;
		try {
			setIsAllowing(true);
			const maxInt = `0x${'f'.repeat(64)}`;
			const gasEstimate = await sUSD.contract.estimate.approve(BOMContract.address, maxInt);
			await sUSD.approve(BOMContract.address, maxInt, {
				gasLimit: normalizeGasLimit(Number(gasEstimate)),
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			});
		} catch (e) {
			console.log(e);
			setIsAllowing(false);
		}
	};

	const handleBidOrRefund = async () => {
		const {
			utils: { parseEther },
		} = snxJSConnector as any;
		const amount = isShort ? shortSideAmount : longSideAmount;
		if (!amount) return;
		try {
			setIsBidding(true);
			const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
			const bidOrRefundFunction = isBid ? BOMContractWithSigner.bid : BOMContractWithSigner.refund;
			const bidOrRefundAmount =
				amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());
			const tx = (await bidOrRefundFunction(isShort ? 1 : 0, bidOrRefundAmount, {
				gasLimit,
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			})) as ethers.ContractTransaction;

			addOptionsPendingTransaction({
				optionTransaction: {
					hash: tx.hash!,
					market: optionsMarket.address,
					currencyKey: optionsMarket.currencyKey,
					account: currentWalletAddress!,
					type,
					amount,
					side,
				},
			});
			tx.wait().then((txResult) => {
				if (txResult && txResult.transactionHash) {
					updateOptionsPendingTransactionStatus({
						hash: txResult.transactionHash,
						status: 'confirmed',
					});
				}
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
			binaryOptionsUtils: { bidOrRefundForPrice },
		} = snxJSConnector as any;
		const setPriceAmountFunction = isShort ? setShortPriceAmount : setLongPriceAmount;
		const setSideAmountFunction = isShort ? setShortSideAmount : setLongSideAmount;
		const bidPrice = isShort ? shortPrice : longPrice;
		try {
			if (!targetPrice || Number(targetPrice) > 1) {
				setPriceAmountFunction('');
				setPriceShift(0);
				if (bidOrRefundForPriceTimer) clearTimeout(bidOrRefundForPriceTimer);
				return;
			}
			setPriceAmountFunction(targetPrice);

			const estimatedAmountNeeded = bidOrRefundForPrice({
				bidSide: isShort ? 1 : 0,
				priceSide: targetShort ? 1 : 0,
				price: parseEther(targetPrice),
				refund: isRefund,
				fee: BN.feeBN,
				refundFee: BN.refundFeeBN,
				longBids: BN.totalLongBN,
				shortBids: BN.totalShortBN,
				deposited: BN.depositedBN,
			});

			setSideAmountFunction(estimatedAmountNeeded / 1e18);
			setPriceShift(getPriceDifference(bidPrice, Number(targetPrice)));

			if (bidOrRefundForPriceTimer) {
				clearTimeout(bidOrRefundForPriceTimer);
			}
			setBidOrRefundForPriceTimer(
				setTimeout(async () => {
					try {
						const amountNeeded = await BOMContract.bidOrRefundForPrice(
							isShort ? 1 : 0,
							targetShort ? 1 : 0,
							parseEther(targetPrice),
							isRefund
						);
						setSideAmountFunction(amountNeeded / 1e18);
					} catch (e) {
						console.log(e);
						setSideAmountFunction('');
					}
				}, TIMEOUT_DELAY)
			);
		} catch (e) {
			console.log(e);
			setPriceAmountFunction('');
		}
	};

	const setBidPriceAmount = (newPrice: number) => {
		const bidPrice = isShort ? shortPrice : longPrice;
		const setBidPriceFunction = isShort ? setShortPriceAmount : setLongPriceAmount;
		setBidPriceFunction(newPrice);
		setPriceShift(getPriceDifference(bidPrice, newPrice));
	};

	const handleBidAmount = async (amount: string) => {
		isShort ? setShortSideAmount(amount) : setLongSideAmount(amount);
		const {
			utils: { parseEther },
			binaryOptionsUtils: { pricesAfterBidOrRefund },
		} = snxJSConnector as any;
		if (!amount) {
			setLongPriceAmount('');
			setShortPriceAmount('');
			if (pricesAfterBidOrRefundTimer) {
				clearTimeout(pricesAfterBidOrRefundTimer);
			}
			return;
		}
		try {
			const bidOrRefundAmount =
				amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());

			const estimatedPrice = pricesAfterBidOrRefund({
				side: isShort ? 1 : 0,
				value: bidOrRefundAmount,
				refund: isRefund,
				longBids: BN.totalLongBN,
				shortBids: BN.totalShortBN,
				fee: BN.feeBN,
				refundFee: BN.refundFeeBN,
				resolved: isResolved,
				deposited: BN.depositedBN,
			});
			setBidPriceAmount(estimatedPrice[side] / 1e18);

			if (pricesAfterBidOrRefundTimer) {
				clearTimeout(pricesAfterBidOrRefundTimer);
			}
			setPricesAfterBidOrRefundTimer(
				setTimeout(async () => {
					try {
						const truePrice = await BOMContract.pricesAfterBidOrRefund(
							isShort ? 1 : 0,
							bidOrRefundAmount,
							isRefund
						);
						setBidPriceAmount(truePrice[side] / 1e18);
					} catch (e) {
						console.log(e);
					}
				}, TIMEOUT_DELAY)
			);
		} catch (e) {
			console.log(e);
		}
	};

	const handleTypeChange = (selectedType: OptionsTransaction['type']) => {
		setType(selectedType);
		setLongPriceAmount('');
		setShortPriceAmount('');
		setLongSideAmount('');
		setShortSideAmount('');
		setPriceShift(0);
	};

	const handleSideChange = (selectedSide: OptionsTransaction['side']) => {
		if (side !== selectedSide) {
			setSide(selectedSide);
			setPriceShift(0);
		}
	};

	return (
		<Card>
			<StyledCardHeader>
				<TabButton isActive={isBid} onClick={() => handleTypeChange('bid')}>
					{t('options.market.trade-card.bidding.bid.title')}
				</TabButton>
				<TabButton isActive={isRefund} onClick={() => handleTypeChange('refund')}>
					{t('options.market.trade-card.bidding.refund.title')}
				</TabButton>
			</StyledCardHeader>
			<StyledCardBody>
				<CardContent>
					<FlexDivRowCentered>
						<Title>{t(`${transKey}.subtitle`)}</Title>
						<WalletBalance>
							<WalletIcon />
							{isWalletConnected
								? formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)
								: EMPTY_VALUE}
						</WalletBalance>
					</FlexDivRowCentered>
				</CardContent>
				<TradeSides>
					<TradeSide
						side="long"
						type={type}
						isActive={isLong}
						amount={longSideAmount}
						onAmountChange={(e) => handleBidAmount(e.target.value)}
						onMaxClick={() => handleBidAmount(isRefund ? longPosition.bid : sUSDBalance)}
						price={longPriceAmount}
						onPriceChange={(e) => handleTargetPrice(e.target.value, false, false, isRefund)}
						onClick={() => handleSideChange('long')}
						transKey={transKey}
						currentPosition={longPosition}
						priceShift={isLong ? priceShift : 0}
					/>
					<TradeSideSeparator />
					<TradeSide
						side="short"
						type={type}
						isActive={isShort}
						amount={shortSideAmount}
						onAmountChange={(e) => handleBidAmount(e.target.value)}
						onMaxClick={() => handleBidAmount(isRefund ? shortPosition.bid : sUSDBalance)}
						price={shortPriceAmount}
						onPriceChange={(e) => handleTargetPrice(e.target.value, true, true, isRefund)}
						onClick={() => handleSideChange('short')}
						transKey={transKey}
						currentPosition={shortPosition}
						priceShift={isShort ? priceShift : 0}
					/>
				</TradeSides>
				<CardContent>
					<BidNetworkFees
						gasLimit={gasLimit}
						type={type}
						fees={fees}
						amount={isLong ? longSideAmount : shortSideAmount}
					/>
					{hasAllowance ? (
						<NetworkInfoTooltip
							open={isBid && Math.abs(priceShift) > SLIPPAGE_THRESHOLD}
							title={t(`${transKey}.confirm-button.high-slippage`)}
						>
							<ActionButton
								size="lg"
								palette="primary"
								disabled={isBidding || !isWalletConnected || !sUSDBalance || !gasLimit}
								onClick={handleBidOrRefund}
							>
								{!isBidding
									? t(`${transKey}.confirm-button.label`)
									: t(`${transKey}.confirm-button.progress-label`)}
							</ActionButton>
						</NetworkInfoTooltip>
					) : (
						<ActionButton
							size="lg"
							palette="primary"
							disabled={isAllowing || !isWalletConnected}
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
									(QUERY_KEYS.BinaryOptions.Market(optionsMarket.address) as unknown) as AnyQueryKey
								)
							}
						/>
					</PhaseEnd>
				</CardContent>
			</StyledCardBody>
		</Card>
	);
};

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
	text-transform: none;
`;

const TradeSides = styled(GridDivCenteredCol)`
	grid-auto-flow: initial;
	grid-template-columns: 1fr auto 1fr;
	border-bottom: 1px solid
		${(props) =>
			props.theme.isDarkTheme ? props.theme.colors.accentL1 : props.theme.colors.accentL2};
`;

const TradeSideSeparator = styled.div`
	width: 1px;
	height: 100%;
	background-color: ${(props) =>
		props.theme.isDarkTheme ? props.theme.colors.accentL1 : props.theme.colors.accentL2};
`;

export default connector(BiddingPhaseCard);
