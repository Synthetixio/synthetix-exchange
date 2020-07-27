import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ConnectedProps, connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setGasPrice, getGasInfo } from 'ducks/transaction';
import { RootState } from 'ducks/types';

import NumericInput from 'components/Input/NumericInput';

const mapStateToProps = (state: RootState) => ({
	gasInfo: getGasInfo(state),
});

const mapDispatchToProps = {
	setGasPrice,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type GasMenuProps = PropsFromRedux & {
	setDropdownIsOpen: (isOpen: boolean) => void;
};

const SelectGasMenuBody: FC<GasMenuProps> = ({
	setGasPrice,
	gasInfo: { gasSpeed, gasPrice },
	setDropdownIsOpen,
}) => {
	const MAX_GWEI_PER_TX = 300;
	const { t } = useTranslation();
	const [customGasPrice, setCustomGasPrice] = useState<number | undefined>(undefined);

	const setGasPriceAndCloseDropdown = (updateGasPrice: number) => {
		setGasPrice(updateGasPrice);
		setDropdownIsOpen(false);
	};

	useEffect(() => {
		if (customGasPrice !== undefined) {
			setGasPrice(customGasPrice);
		}
	}, [setGasPrice, customGasPrice]);

	return (
		<Content>
			<StyledNumericInput
				value={customGasPrice}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const newPrice = Number(e.target.value);
					if (newPrice < MAX_GWEI_PER_TX) {
						setCustomGasPrice(newPrice);
					}
				}}
				placeholder={t('modals.gwei.placeholder')}
				step="0.1"
				min="0"
			/>
			<DefinedGasSelector
				isActive={gasPrice === gasSpeed.slowAllowed}
				onClick={() => setGasPriceAndCloseDropdown(gasSpeed.slowAllowed)}
			>
				<div>{t('modals.gwei.table.safe')}</div>
				<div>{gasSpeed.slowAllowed}</div>
			</DefinedGasSelector>
			<DefinedGasSelector
				isActive={gasPrice === gasSpeed.averageAllowed}
				onClick={() => setGasPriceAndCloseDropdown(gasSpeed.averageAllowed)}
			>
				<div>{t('modals.gwei.table.standard')}</div>
				<div>{gasSpeed.averageAllowed}</div>
			</DefinedGasSelector>
			<DefinedGasSelector
				isActive={gasPrice === gasSpeed.fastestAllowed}
				onClick={() => setGasPriceAndCloseDropdown(gasSpeed.fastestAllowed)}
			>
				<div>{t('modals.gwei.table.fast')}</div>
				<div>{gasSpeed.fastestAllowed}</div>
			</DefinedGasSelector>
		</Content>
	);
};

const Content = styled.div`
	width: 100%;
	height: 100%;
`;

const StyledNumericInput = styled(NumericInput)`
	width: calc(100% - 20px);
	margin: 10px 10px 0 10px;
	font-size: 12px;
	height: 36px;
	color: ${({ theme }) => theme.colors.fontTertiary};
	background-color: ${({ theme }) => theme.colors.accentL1};
`;

const DefinedGasSelector = styled.div<{ isActive: boolean }>`
	padding: 10px;
	margin: 10px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	color: ${(props) => props.theme.colors.fontTertiary};
	${(props) => props.isActive && `background-color: ${props.theme.colors.accentL1}`};
	height: 32px;
	&:hover {
		color: ${({ theme }) => theme.colors.fontPrimary};
		background-color: ${({ theme }) => theme.colors.accentL1};
		span {
			background-color: ${(props) => props.theme.colors.accentL2};
		}
	}
`;

export default connector(SelectGasMenuBody);
