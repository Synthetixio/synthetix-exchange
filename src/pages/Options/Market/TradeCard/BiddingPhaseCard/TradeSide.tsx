import React, { FC, memo, useContext } from 'react';
import styled, { css, ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { OptionsTransaction } from 'pages/Options/types';

import { ReactComponent as TrendUpIcon } from 'assets/images/trend-up.svg';
import { ReactComponent as TrendDownIcon } from 'assets/images/trend-down.svg';

import { GridDivRow, CurrencyKey, FlexDiv } from 'shared/commonStyles';

import { SYNTHS_MAP } from 'constants/currency';

import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters';

import NumericInput from 'components/Input/NumericInput';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { formLabelSmallCSS } from 'components/Typography/Form';

import { CurrentPosition } from './types';
import { labelMediumCSS } from 'components/Typography/Label';
import NetworkInfoTooltip from 'pages/Trade/components/CreateOrderCard/NetworkInfoTooltip';
import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

type TradeSideProps = {
	isActive: boolean;
	side: OptionsTransaction['side'];
	type: OptionsTransaction['type'];
	amount: OptionsTransaction['amount'] | string;
	price: string | number;
	onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
	transKey?: string;
	currentPosition: CurrentPosition;
	priceShift: number;
};

const TradeSide: FC<TradeSideProps> = memo(
	({
		isActive,
		type,
		side,
		amount,
		price,
		onPriceChange,
		onAmountChange,
		onClick,
		transKey,
		currentPosition,
		priceShift,
	}) => {
		const { t } = useTranslation();
		const theme = useContext(ThemeContext);

		const amountInputId = `${type}-${side}-amount`;
		const priceInputId = `${type}-${side}-price`;

		return (
			<Container isActive={isActive} onClick={onClick}>
				<Section>
					<FormRow>
						<FormControl>
							<FormInputLabel htmlFor={amountInputId}>
								{t(`${transKey}.amount-label`)}
							</FormInputLabel>
							<StyledNumericInputWithCurrency
								currencyKey={SYNTHS_MAP.sUSD}
								value={amount}
								onChange={onAmountChange}
								showIcon={false}
								inputProps={{
									id: amountInputId,
								}}
							/>
						</FormControl>
					</FormRow>
					<FormRow>
						<FormControl>
							<FormLabelRow>
								<FormInputLabel htmlFor={priceInputId}>
									{t(`${transKey}.price-label`)}
								</FormInputLabel>
								<FlexDiv>
									<FormInputLabel>{formatPercentage(priceShift, 0)}</FormInputLabel>
									<NetworkInfoTooltip title={'test'}>
										<QuestionMarkIcon>
											<QuestionMarkStyled />
										</QuestionMarkIcon>
									</NetworkInfoTooltip>
								</FlexDiv>
							</FormLabelRow>
							<StyledNumericInput
								id={priceInputId}
								value={price}
								onChange={onPriceChange}
								placeholder="0"
							/>
						</FormControl>
					</FormRow>
					<FormRow>
						{side === 'long' && (
							<LongSideIndication>
								{t('options.common.long')} <TrendUpIcon />
							</LongSideIndication>
						)}
						{side === 'short' && (
							<ShortSideIndication>
								{t('options.common.short')} <TrendDownIcon />
							</ShortSideIndication>
						)}
					</FormRow>
				</Section>
				<CurrentPositionSection>
					<SectionTitle>
						{t('options.market.trade-card.bidding.common.current-position')}
					</SectionTitle>
					<SectionBody>
						{t('options.market.trade-card.bidding.common.bid')}{' '}
						<StyledCurrencyKey>
							{formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.bid)}
						</StyledCurrencyKey>
					</SectionBody>
					<SectionBody>
						{t('options.market.trade-card.bidding.common.payout')}{' '}
						<StyledCurrencyKey>
							{formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.payout)}
						</StyledCurrencyKey>
					</SectionBody>
				</CurrentPositionSection>
				<ToggleIcon>
					<svg
						width="8"
						height="8"
						viewBox="0 0 8 8"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						key={type}
					>
						{isActive ? (
							<>
								<circle cx="4" cy="4" r="4" fill={theme.colors.brand} />
								<circle cx="4" cy="4" r="2" fill={theme.colors.accentL1} />
							</>
						) : (
							<circle cx="4" cy="4" r="4" fill={theme.colors.accentL1} />
						)}
					</svg>
				</ToggleIcon>
			</Container>
		);
	}
);

const ToggleIcon = styled.div`
	position: absolute;
	top: 12px;
	right: 18px;
`;

const Section = styled.div`
	${formLabelSmallCSS};
`;

const Container = styled(GridDivRow)<{ isActive: boolean }>`
	position: relative;
	padding: 12px;
	grid-gap: 12px;
	> ${Section} {
		padding: 12px;
		background-color: ${(props) =>
			props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};

		border: 1px solid
			${(props) => (props.isActive ? props.theme.colors.accentL2 : props.theme.colors.accentL1)};
	}
	${(props) =>
		!props.isActive &&
		css`
			cursor: pointer;
		`};
`;

const FormInputLabel = styled.label`
	color: ${(props) => props.theme.colors.fontSecondary};
	text-align: left;
	cursor: pointer;
`;

const FormRow = styled.div`
	padding-bottom: 10px;
`;

const FormControl = styled(GridDivRow)`
	grid-gap: 8px;
`;

const FormLabelRow = styled(FlexDiv)`
	justify-content: space-between;
`;

const StyledNumericInput = styled(NumericInput)`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	border-color: ${(props) => props.theme.colors.accentL1};
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		background-color: ${(props) => props.theme.colors.surfaceL2};
		border-color: ${(props) => props.theme.colors.accentL1};
	}

	.currency-container {
		background-color: ${(props) => props.theme.colors.surfaceL3};
		border-color: ${(props) => props.theme.colors.accentL1};
		> span {
			color: ${(props) => props.theme.colors.fontPrimary};
		}
	}
`;

const SideIndication = styled.div`
	${labelMediumCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	border-radius: 1px;
	height: 32px;
	padding: 8px;
	text-align: center;
	cursor: default;
`;

const LongSideIndication = styled(SideIndication)`
	background-color: ${(props) => props.theme.colors.green};
`;
const ShortSideIndication = styled(SideIndication)`
	background-color: ${(props) => props.theme.colors.red};
`;

const CurrentPositionSection = styled(Section)`
	text-align: center;
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const SectionTitle = styled.div`
	padding-bottom: 8px;
`;

const StyledCurrencyKey = styled(CurrencyKey)`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const SectionBody = styled.div`
	padding-bottom: 3px;
`;

const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
	margin-left: 4px;
`;

const QuestionMarkStyled = styled(QuestionMark)`
	height: 8px;
`;

export default TradeSide;
