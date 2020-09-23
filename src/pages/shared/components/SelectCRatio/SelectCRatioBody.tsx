import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NumericInput from 'components/Input/NumericInput';
import { Message } from 'shared/commonStyles';

type GasMenuProps = {
	cRatio: string;
	setCRatio: Function;
	setDropdownIsOpen: (isOpen: boolean, updatedCRatio: string) => void;
};

const SelectCRatioBody: FC<GasMenuProps> = ({ setCRatio, cRatio, setDropdownIsOpen }) => {
	const { t } = useTranslation();
	const [customCRatio, setCustomCRatio] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const setCRatioAndCloseDropdown = (updatedCRatio: string) => {
		setCRatio(updatedCRatio);
		setDropdownIsOpen(false, updatedCRatio);
	};

	useEffect(() => {
		if (customCRatio) {
			const customGasPriceNum = Number(customCRatio);
			const exceedsCRatioLimit = customGasPriceNum < 150;

			setCRatio(exceedsCRatioLimit ? 150 : Math.max(0, customGasPriceNum).toString());
			setErrorMessage(exceedsCRatioLimit ? t('common.errors.c-ratio-exceeded') : undefined);
		}
	}, [setCRatio, customCRatio, t]);

	return (
		<Content>
			<StyledNumericInput
				value={customCRatio}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setCustomCRatio(e.target.value);
				}}
				placeholder={t('modals.gwei.placeholder')}
				step="0.1"
				min="0"
			/>
			{errorMessage && (
				<StyledMessage type="error" floating={true} size="sm">
					{errorMessage}
				</StyledMessage>
			)}
			<DefinedGasSelector
				needsPadding={errorMessage !== undefined}
				onClick={() => setCRatioAndCloseDropdown('200')}
			>
				<div>{t('modals.c-ratio.safe')}</div>
				<div>200%</div>
			</DefinedGasSelector>
			<DefinedGasSelector onClick={() => setCRatioAndCloseDropdown('165')}>
				<div>{t('modals.c-ratio.safe-max')}</div>
				<div>165%</div>
			</DefinedGasSelector>
			<DefinedGasSelector onClick={() => setCRatioAndCloseDropdown('155')}>
				<div>{t('modals.c-ratio.high-risk')}</div>
				<div>155%</div>
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

const DefinedGasSelector = styled.div<{ needsPadding?: boolean }>`
	padding: 10px;
	margin: 10px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	color: ${(props) => props.theme.colors.fontTertiary};
	${(props) => props.needsPadding && 'margin-top: 37px'};
	height: 32px;
	&:hover {
		color: ${({ theme }) => theme.colors.fontPrimary};
		background-color: ${({ theme }) => theme.colors.accentL1};
		span {
			background-color: ${(props) => props.theme.colors.accentL2};
		}
	}
`;

const StyledMessage = styled(Message)`
	width: calc(100% - 20px);
	border-radius: 4px;
	margin-top: 6px;
	margin-left: 10px;
	margin-bottom: 6px;
`;

export default SelectCRatioBody;
