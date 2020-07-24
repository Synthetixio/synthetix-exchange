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
	gasInfo: { gasSpeed },
	setDropdownIsOpen,
}) => {
	const { t } = useTranslation();
	const [customGasPrice, setCustomGasPrice] = useState<number | undefined>(undefined);

	const setGasPriceAndCloseDropdown = (gasPrice: number) => {
		setGasPrice(gasPrice);
		setDropdownIsOpen(false);
	};

	useEffect(() => {
		// eslint-disable-next-line eqeqeq
		if (customGasPrice != undefined) {
			setGasPrice(customGasPrice);
		}
	}, [setGasPrice, customGasPrice]);

	return (
		<Content>
			<StyledNumericInput
				id="1"
				value={customGasPrice}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const newPrice = Number(e.target.value);
					if (newPrice < 300) {
						setCustomGasPrice(newPrice);
					}
				}}
				placeholder="CUSTOM"
				step="0.1"
				min="0"
			/>
			<DefinedGasSelector onClick={() => setGasPriceAndCloseDropdown(gasSpeed.slowAllowed)}>
				<div>{t('modals.gwei.table.slow')}</div>
				<div>{gasSpeed.slowAllowed}</div>
			</DefinedGasSelector>
			<DefinedGasSelector onClick={() => setGasPriceAndCloseDropdown(gasSpeed.averageAllowed)}>
				<div>{t('modals.gwei.table.average')}</div>
				<div>{gasSpeed.averageAllowed}</div>
			</DefinedGasSelector>
			<DefinedGasSelector onClick={() => setGasPriceAndCloseDropdown(gasSpeed.fastestAllowed)}>
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

const DefinedGasSelector = styled.div`
	padding: 10px;
	margin: 10px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	color: ${({ theme }) => theme.colors.fontTertiary};
	height: 32px;
	&:hover {
		color: ${({ theme }) => theme.colors.fontPrimary};
		background-color: ${({ theme }) => theme.colors.accentL1};
		span {
			background-color: ${(props) => props.theme.colors.accentL2};
		}
	}
	&.active {
		background-color: ${({ theme }) => theme.colors.accentL2};
		color: ${({ theme }) => theme.colors.fontPrimary};
		&:hover {
			span {
				background-color: ${(props) => props.theme.colors.accentL1};
			}
		}
	}
`;

export default connector(SelectGasMenuBody);
