import React, { FC, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { queryCache, AnyQueryKey } from 'react-query';

import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/transactions';

import { TradeCardPhaseProps } from 'pages/Options/types';
import { RootState } from 'ducks/types';
import { getIsWalletConnected, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import {
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
} from 'ducks/options/pendingTransaction';

import Card from 'components/Card';
import NetworkFees from 'pages/Options/components/NetworkFees';

import { ReactComponent as ClockIcon } from 'assets/images/clock.svg';
import QUERY_KEYS from 'constants/queryKeys';

import {
	StyledTimeRemaining,
	CardContent,
	ActionButton,
	StyledCardHeader,
	StyledCardBody,
	PhaseEnd,
} from '../common';
import ResultCard from '../components/ResultCard';
import { useBOMContractContext } from '../../contexts/BOMContractContext';

import TxErrorMessage from 'components/TxErrorMessage';
import { ethers } from 'ethers';

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const mapDispatchToProps = {
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradingPhaseCardProps = PropsFromRedux & TradeCardPhaseProps;

const TradingPhaseCard: FC<TradingPhaseCardProps> = memo(
	({
		optionsMarket,
		isWalletConnected,
		accountMarketInfo,
		addOptionsPendingTransaction,
		updateOptionsPendingTransactionStatus,
		currentWalletAddress,
	}) => {
		const { t } = useTranslation();
		const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

		const BOMContract = useBOMContractContext();

		const [isClaiming, setIsClaiming] = useState<boolean>(false);
		const [gasLimit, setGasLimit] = useState<number | null>(null);

		const { bids, balances, claimable } = accountMarketInfo;

		const nothingToClaim = !bids.short && !bids.long;
		const buttonDisabled = isClaiming || !isWalletConnected || nothingToClaim || !gasLimit;

		useEffect(() => {
			const fetchGasLimit = async () => {
				if (!isWalletConnected) return;
				try {
					const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
					const gasEstimate = await BOMContractWithSigner.estimate.claimOptions();
					setGasLimit(normalizeGasLimit(Number(gasEstimate)));
				} catch (e) {
					console.log(e);
					setGasLimit(null);
				}
			};
			fetchGasLimit();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isWalletConnected]);

		const handleClaim = async () => {
			try {
				setTxErrorMessage(null);
				setIsClaiming(true);
				const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
				const tx = (await BOMContractWithSigner.claimOptions()) as ethers.ContractTransaction;

				const sharedPendingTxProps = {
					market: optionsMarket.address,
					currencyKey: optionsMarket.currencyKey,
					account: currentWalletAddress!,
				};

				if (claimable.long) {
					addOptionsPendingTransaction({
						optionTransaction: {
							...sharedPendingTxProps,
							hash: tx.hash!,
							type: 'claim',
							amount: claimable.long,
							side: 'long',
						},
					});
				}

				if (claimable.short) {
					addOptionsPendingTransaction({
						optionTransaction: {
							...sharedPendingTxProps,
							hash: tx.hash!,
							type: 'claim',
							amount: claimable.short,
							side: 'short',
						},
					});
				}

				const txResult = await tx.wait();
				if (txResult && txResult.transactionHash) {
					updateOptionsPendingTransactionStatus({
						hash: txResult.transactionHash,
						status: 'confirmed',
					});
				}
			} catch (e) {
				console.log(e);
				setTxErrorMessage(t('common.errors.unknown-error-try-again'));
			} finally {
				setIsClaiming(false);
			}
		};

		return (
			<Card>
				<StyledCardHeader>{t('options.market.trade-card.trading.title')}</StyledCardHeader>
				<StyledCardBody>
					<StyledResultCard
						icon={<ClockIcon />}
						title={t('options.market.trade-card.trading.card-title')}
						subTitle={t('options.market.trade-card.trading.card-subtitle')}
						longAmount={balances.long}
						shortAmount={balances.short}
						longPrice={optionsMarket.longPrice}
						shortPrice={optionsMarket.shortPrice}
						claimableLongAmount={claimable.long}
						claimableShortAmount={claimable.short}
					/>
					<StyledCardContent>
						<NetworkFees gasLimit={gasLimit} />
						<ActionButton
							size="lg"
							palette="primary"
							disabled={buttonDisabled}
							onClick={handleClaim}
						>
							{nothingToClaim
								? t('options.market.trade-card.trading.confirm-button.success-label')
								: !isClaiming
								? t('options.market.trade-card.trading.confirm-button.label')
								: t('options.market.trade-card.trading.confirm-button.progress-label')}
						</ActionButton>
						{txErrorMessage && (
							<TxErrorMessage onDismiss={() => setTxErrorMessage(null)}>
								{txErrorMessage}
							</TxErrorMessage>
						)}
						<PhaseEnd>
							{t('options.market.trade-card.trading.footer.end-label')}{' '}
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
					</StyledCardContent>
				</StyledCardBody>
			</Card>
		);
	}
);

const StyledResultCard = styled(ResultCard)`
	margin-bottom: 94px;
`;

const StyledCardContent = styled(CardContent)`
	border-top: 1px solid ${(props) => props.theme.colors.accentL1};
`;

export default connector(TradingPhaseCard);
