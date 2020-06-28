import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { OptionsMarketInfo, AccountMarketInfo } from 'ducks/options/types';
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

import { toBigNumber } from 'utils/formatters';

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

		const [isClaiming, setisClaiming] = useState<boolean>(false);

		const {
			nothingToClaim,
			bidLongAmount,
			bidShortAmount,
			totalLongPrice,
			totalShortPrice,
		} = accountMarketInfo;

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
						longAmount={bidLongAmount}
						shortAmount={bidShortAmount}
						totalLongPrice={totalLongPrice}
						totalShortPrice={totalShortPrice}
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
