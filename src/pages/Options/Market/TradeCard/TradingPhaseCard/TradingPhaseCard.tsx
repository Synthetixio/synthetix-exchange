import React, { FC, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { queryCache, AnyQueryKey } from 'react-query';

import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/transactions';

import { OptionsMarketInfo, AccountMarketInfo } from 'pages/Options/types';
import { RootState } from 'ducks/types';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

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

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
	accountMarketInfo: AccountMarketInfo;
};

const TradingPhaseCard: FC<TradingPhaseCardProps> = memo(
	({ optionsMarket, isLoggedIn, accountMarketInfo }) => {
		const { t } = useTranslation();
		const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

		const BOMContract = useBOMContractContext();

		const [isClaiming, setIsClaiming] = useState<boolean>(false);
		const [gasLimit, setGasLimit] = useState<number | null>(null);

		const { bids, balances, claimable } = accountMarketInfo;

		const nothingToClaim = !bids.short && !bids.long;
		const buttonDisabled = isClaiming || !isLoggedIn || nothingToClaim || !gasLimit;

		useEffect(() => {
			const fetchGasLimit = async () => {
				if (!isLoggedIn) return;
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
		}, [isLoggedIn]);

		const handleClaim = async () => {
			try {
				setTxErrorMessage(null);
				setIsClaiming(true);
				const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
				await BOMContractWithSigner.claimOptions();
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
