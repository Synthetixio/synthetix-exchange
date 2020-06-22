import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { OptionsTransaction } from 'ducks/options/types';
import { GridDivCol, GridDivRow } from 'shared/commonStyles';
import NumericInput from 'components/Input/NumericInput';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';

import { SYNTHS_MAP } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters';
import { formLabelLargeCSS } from 'components/Typography/Form';

type TradeSideProps = {
	isActive: boolean;
	side: OptionsTransaction['side'];
	type: OptionsTransaction['type'];
	amount: OptionsTransaction['amount'];
	price: string | number;
	onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
};

const TradeSide: FC<TradeSideProps> = memo(
	({ isActive, type, side, amount, price, onPriceChange, onAmountChange, onClick }) => {
		const { t } = useTranslation();

		const transKey =
			type === 'bid'
				? 'options.market.trade-card.bidding.bid'
				: 'options.market.trade-card.bidding.refund';

		const getTranslation = (key: string) => t(`${transKey}.${key}`);

		const amountInputId = `${type}-${side}-amount`;
		const priceInputId = `${type}-${side}-price`;

		return (
			<Container isActive={isActive} onClick={onClick}>
				<Section>
					<FormRow>
						<FormControlGroup>
							<FormControl>
								<FormInputLabel htmlFor={amountInputId}>
									{getTranslation('amount-label')}
								</FormInputLabel>
							</FormControl>
							<StyledNumericInputWithCurrency
								currencyKey={SYNTHS_MAP.sUSD}
								value={amount}
								onChange={onAmountChange}
								showIcon={false}
								inputProps={{
									id: amountInputId,
								}}
							/>
						</FormControlGroup>
					</FormRow>
					<FormControlGroup>
						<FormControl>
							<FormInputLabel htmlFor={priceInputId}>
								{getTranslation('price-label')}
							</FormInputLabel>
							<StyledNumericInput
								id={priceInputId}
								value={price}
								onChange={onPriceChange}
								placeholder="0"
							/>
						</FormControl>
					</FormControlGroup>
				</Section>
				<Section>
					<div>{t('options.market.trade-card.bidding.common.current-position')}</div>
					<div>
						{t('options.market.trade-card.bidding.common.bid')}
						{formatCurrencyWithKey(SYNTHS_MAP.sUSD, 0)}
					</div>
					<div>
						{t('options.market.trade-card.bidding.common.payoff')}
						{formatCurrencyWithKey(SYNTHS_MAP.sUSD, 0)}
					</div>
				</Section>
			</Container>
		);
	}
);

const Container = styled(GridDivRow)<{ isActive: boolean }>`
	padding: 12px;
	grid-gap: 12px;
	> div {
		padding: 12px;
		background-color: ${(props) =>
			props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};

		border: 1px solid
			${(props) => (props.isActive ? props.theme.colors.accentL2 : props.theme.colors.accentL1)};
	}
`;

const Section = styled.div``;

const FormInputLabel = styled.label`
	${formLabelLargeCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	text-align: left;
	cursor: pointer;
`;

const FormRow = styled.div`
	padding-bottom: 24px;
`;

const FormControlGroup = styled(GridDivRow)`
	grid-gap: 24px;
`;

const FormControl = styled(GridDivRow)`
	grid-gap: 8px;
`;

const StyledNumericInput = styled(NumericInput)`
	border-color: transparent;
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		border-top-color: transparent;
		border-bottom-color: transparent;
		border-right-color: transparent;
		border-left-color: ${(props) => props.theme.colors.accentL1};
	}

	.currency-container {
		border-color: transparent;
	}
`;

export default TradeSide;
