import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { OptionsMarketInfo } from 'ducks/options/types';
import { RootState } from 'ducks/types';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

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

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradingPhaseCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
};
const TradingPhaseCard: FC<TradingPhaseCardProps> = memo(({ optionsMarket, isLoggedIn }) => {
	const { t } = useTranslation();
	const [isClaiming, setisClaiming] = useState<boolean>(false);
	const [isAlreadyClaimed, setIsAlreadyClaimed] = useState<boolean>(false);

	const handleClaim = () => {
		console.log('TODO');
	};

	return (
		<Card>
			<StyledCardHeader>{t('options.market.trade-card.trading.title')}</StyledCardHeader>
			<StyledCardBody>
				<StyledResultCard
					icon={<ClockIcon />}
					title={t('options.market.trade-card.trading.card-title')}
					subTitle={t('options.market.trade-card.trading.card-subtitle')}
					longAmount={0}
					shortAmount={0}
					longPrice={0}
					shortPrice={0}
				/>
				<StyledCardContent>
					<NetworkFees gasLimit={null} />
					<ActionButton
						size="lg"
						palette="primary"
						disabled={isClaiming || !isLoggedIn || isAlreadyClaimed}
						onClick={handleClaim}
					>
						{isAlreadyClaimed
							? t('options.market.trade-card.trading.confirm-button.success-label')
							: !isClaiming
							? t('options.market.trade-card.trading.confirm-button.label')
							: t('options.market.trade-card.trading.confirm-button.progress-label')}
					</ActionButton>
					<PhaseEnd>
						{t('options.market.trade-card.bidding.footer.end-label')}{' '}
						<StyledTimeRemaining end={optionsMarket.timeRemaining} />
					</PhaseEnd>
				</StyledCardContent>
			</StyledCardBody>
		</Card>
	);
});

const StyledResultCard = styled(ResultCard)`
	margin-bottom: 94px;
`;

const StyledCardContent = styled(CardContent)`
	border-top: 1px solid ${(props) => props.theme.colors.accentL1};
`;

export default connector(TradingPhaseCard);
