import React, { FC, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/transactions';

import { OptionsMarketInfo, AccountMarketInfo } from 'pages/Options/types';
import { RootState } from 'ducks/types';
import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import Card from 'components/Card';
import NetworkFees from 'pages/Options/components/NetworkFees';

import { ReactComponent as ClockIcon } from 'assets/images/clock.svg';

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

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
	accountMarketInfo: AccountMarketInfo;
};

const TradingPhaseCard: FC<TradingPhaseCardProps> = memo(
	({ optionsMarket, isLoggedIn, currentWalletAddress = '', accountMarketInfo }) => {
		const { t } = useTranslation();
		const BOMContract = useBOMContractContext();

		const [isClaiming, setIsClaiming] = useState<boolean>(false);
		const [gasLimit, setGasLimit] = useState<number | null>(null);

		const { bids } = accountMarketInfo;

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
				setIsClaiming(true);
				const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
				await BOMContractWithSigner.claimOptions();
				setIsClaiming(false);
			} catch (e) {
				console.log(e);
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
						longAmount={bids.long}
						shortAmount={bids.short}
						totalLongPrice={optionsMarket.longPrice * bids.long}
						totalShortPrice={optionsMarket.shortPrice * bids.short}
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
						<PhaseEnd>
							{t('options.market.trade-card.trading.footer.end-label')}{' '}
							<StyledTimeRemaining end={optionsMarket.timeRemaining} />
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
