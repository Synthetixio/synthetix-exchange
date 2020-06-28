import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import snxJSConnector from 'utils/snxJSConnector';

import { OptionsMarketInfo } from 'ducks/options/types';
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
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter, toBigNumber } from 'utils/formatters';

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
};

const TradingPhaseCard: FC<TradingPhaseCardProps> = memo(
	({ optionsMarket, isLoggedIn, currentWalletAddress = '' }) => {
		const { t } = useTranslation();
		const BOMContract = useBOMContractContext();

		const [isClaiming, setisClaiming] = useState<boolean>(false);

		const accountMarketInfoQuery = useQuery(
			QUERY_KEYS.BinaryOptions.AccountMarketInfo(
				optionsMarket.address,
				currentWalletAddress as string
			),
			async () => {
				const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAccountMarketInfo(
					optionsMarket.address,
					currentWalletAddress
				);

				return {
					claimable: {
						long: bigNumberFormatter(result.claimable.long),
						short: bigNumberFormatter(result.claimable.short),
					},
					balances: {
						long: bigNumberFormatter(result.claimable.long),
						short: bigNumberFormatter(result.claimable.short),
					},
					bids: {
						long: bigNumberFormatter(result.claimable.long),
						short: bigNumberFormatter(result.claimable.short),
					},
				};
			},
			{
				enabled: isLoggedIn,
			}
		);

		let longAmount = toBigNumber(0);
		let shortAmount = toBigNumber(0);
		let totalLongPrice = toBigNumber(0);
		let totalShortPrice = toBigNumber(0);
		let nothingToClaim = true;

		if (isLoggedIn && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
			const { bids } = accountMarketInfoQuery.data;

			longAmount = toBigNumber(bids.long);
			shortAmount = toBigNumber(bids.short);
			totalLongPrice = toBigNumber(optionsMarket.longPrice).multipliedBy(longAmount);
			totalShortPrice = toBigNumber(optionsMarket.shortPrice).multipliedBy(shortAmount);
			nothingToClaim = longAmount.isZero() && shortAmount.isZero();
		}

		const buttonDisabled = isClaiming || !isLoggedIn || nothingToClaim;

		const handleClaim = async () => {
			// TODO: implement
			const res = await BOMContract.estimate.claimOptions(currentWalletAddress);
			console.log(res);
		};

		return (
			<Card>
				<StyledCardHeader>{t('options.market.trade-card.trading.title')}</StyledCardHeader>
				<StyledCardBody>
					<StyledResultCard
						icon={<ClockIcon />}
						title={t('options.market.trade-card.trading.card-title')}
						subTitle={t('options.market.trade-card.trading.card-subtitle')}
						longAmount={longAmount.toNumber()}
						shortAmount={shortAmount.toNumber()}
						totalLongPrice={totalLongPrice.toNumber()}
						totalShortPrice={totalShortPrice.toNumber()}
					/>
					<StyledCardContent>
						<NetworkFees gasLimit={null} />
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
