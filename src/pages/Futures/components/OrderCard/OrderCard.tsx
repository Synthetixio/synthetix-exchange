import React, { FC, useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { getSynthPair } from 'ducks/synths';
import { getSynthsWalletBalances } from 'ducks/wallet/walletBalances';

import { RootState } from 'ducks/types';
import { EMPTY_VALUE } from 'constants/placeholder';
import { formatCurrency } from 'utils/formatters';

import { FormInputLabel, FormInputLabelSmall, FlexDiv } from 'shared/commonStyles';

import Card from 'components/Card';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import LeverageInput from '../LeverageInput';
import OrderInfoBlock from '../OrderInfoBlock';
import OrderSubmitCard from '../OrderSubmitCard';

const INPUT_DEFAULT_VALUE = '';
const INPUT_DEFAULT_LEVERAGE = 1;

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
	synthPair: getSynthPair(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OrderBookCardProps = PropsFromRedux;

const OrderBookCard: FC<OrderBookCardProps> = ({
	synthPair,
	isWalletConnected,
	synthsWalletBalances,
}) => {
	const { t } = useTranslation();
	const { base, quote } = synthPair;
	const [amount, setAmount] = useState(INPUT_DEFAULT_VALUE);
	const [margin, setMargin] = useState(INPUT_DEFAULT_VALUE);
	const [leverage, setLeverage] = useState(INPUT_DEFAULT_LEVERAGE);
	const [isLong, setIsLong] = useState(true);

	const sUSDBalance =
		(synthsWalletBalances && synthsWalletBalances.find((synth) => synth.name === quote.name)) || 0;

	const setMaxSUSDBalance = () => {
		if (!sUSDBalance || !sUSDBalance.balance) return;
		setAmount(sUSDBalance.balance);
		setMargin(sUSDBalance.balance);
	};

	return (
		<StyledCard>
			<StyledCardBody>
				<OrderInfoColumn>
					<NumericInputWithCurrency
						currencyKey={base.name}
						value={`${amount}`}
						label={
							<FormInputLabel>{t('futures.futures-order-card.input-label.amount')}:</FormInputLabel>
						}
						onChange={(_, value) => {
							setAmount(value);
							setMargin(value);
						}}
						errorMessage={null}
						onMaxButtonClick={() => {
							setAmount('100');
							setMargin('100');
						}}
					/>

					<OrderInfoBlock
						orderData={[
							{ label: t('futures.futures-order-card.order-info.notional-value'), value: '- sBTC' },
							{ label: t('futures.futures-order-card.order-info.pnl'), value: '- sBTC' },
						]}
					/>
				</OrderInfoColumn>
				<OrderInfoColumn>
					<NumericInputWithCurrency
						currencyKey={quote.name}
						value={`${amount}`}
						label={
							<>
								<FormInputLabel>
									{t('futures.futures-order-card.input-label.margin')}:
								</FormInputLabel>
								<StyledFormInputLabelSmall isInteractive={sUSDBalance} onClick={setMaxSUSDBalance}>
									{t('common.wallet.balance-currency', {
										balance: sUSDBalance
											? formatCurrency(sUSDBalance.balance)
											: !isEmpty(synthsWalletBalances)
											? 0
											: EMPTY_VALUE,
									})}
								</StyledFormInputLabelSmall>
							</>
						}
						onChange={(_, value) => {
							setAmount(value);
							setMargin(value);
						}}
						errorMessage={null}
					/>
					<OrderInfoBlock
						orderData={[
							{ label: t('futures.futures-order-card.order-info.order-price'), value: '- sBTC' },
							{
								label: t('futures.futures-order-card.order-info.liquidation-price'),
								value: '- sBTC',
							},
						]}
					/>
				</OrderInfoColumn>
				<OrderInfoColumn>
					<LeverageInput
						value={`${leverage}`}
						label={
							<>
								<FormInputLabel>
									{t('futures.futures-order-card.input-label.leverage')}:
								</FormInputLabel>
								<StyledFormInputLabel isInteractive={false}>{`${
									leverage > INPUT_DEFAULT_LEVERAGE ? leverage : INPUT_DEFAULT_LEVERAGE
								}x`}</StyledFormInputLabel>
							</>
						}
						onChange={(_, value) => {
							setLeverage(Number(value));
						}}
						isLong={isLong}
						onLongButtonClick={() => setIsLong(true)}
						onShortButtonClick={() => setIsLong(false)}
						errorMessage={null}
					/>
					<OrderInfoBlock
						orderData={[
							{
								label: t('futures.futures-order-card.order-info.daily-funding-rate'),
								value: '- sBTC',
							},
							{ label: t('futures.futures-order-card.order-info.net-funding'), value: '- sBTC' },
						]}
					/>
				</OrderInfoColumn>
				<OrderInfoColumn>
					<OrderSubmitCard />
				</OrderInfoColumn>
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	width: 100%;
	display: flex;
`;

const StyledCardBody = styled(Card.Body)`
	display: flex;
	padding: 12px;
`;

const OrderInfoColumn = styled(FlexDiv)`
	flex-direction: column;
	flex: 1;
	&:not(:last-child) {
		margin: 12px 24px 0 0;
	}
`;

const StyledFormInputLabel = styled(FormInputLabel)<{ isInteractive: boolean }>`
	cursor: ${(props) => (props.isInteractive ? 'pointer' : 'default')};
	text-transform: none;
	font-family: ${(props) => props.theme.fonts.bold};
`;

const StyledFormInputLabelSmall = styled(FormInputLabelSmall)<{ isInteractive: boolean }>`
	cursor: ${(props) => (props.isInteractive ? 'pointer' : 'default')};
`;

export default connector(OrderBookCard);
