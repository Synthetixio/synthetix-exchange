import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import DropdownPanel from 'components/DropdownPanel';

import { LinkTextSmall } from 'shared/commonStyles';
import { media } from 'shared/media';

import SelectCRatioBody from './SelectCRatioBody';

type SelectCRatioProps = {
	setCRatio: Function;
	cRatio: string;
	gasPrice: number;
	addPadding?: boolean;
};

export const SelectCRatio = ({ cRatio, setCRatio, addPadding = false }: SelectCRatioProps) => {
	const { t } = useTranslation();
	const [cRatioDropdownOpen, setcRatioDropdownOpen] = useState(false);
	const setDropdownIsOpen = (isOpen: boolean, cRatio: string) => {
		if (!isOpen && !cRatioDropdownOpen) {
			return;
		}
		setCRatio(cRatio);
		setcRatioDropdownOpen(isOpen);
	};

	return (
		<StyledDropdownPanel
			height="auto"
			isOpen={cRatioDropdownOpen}
			handleClose={() => setDropdownIsOpen(false, cRatio)}
			width="170px"
			onHeaderClick={() => setDropdownIsOpen(!cRatioDropdownOpen, cRatio)}
			header={
				<GasEditFields>
					<div>{parseFloat(cRatio)}%</div>
					<StyledLinkTextSmall addPadding={addPadding}>
						{t('common.actions.edit')}
					</StyledLinkTextSmall>
				</GasEditFields>
			}
			body={
				<SelectCRatioBody
					setCRatio={setCRatio}
					cRatio={cRatio}
					setDropdownIsOpen={setDropdownIsOpen}
				/>
			}
		/>
	);
};

const StyledDropdownPanel = styled(DropdownPanel)`
	${media.medium`
		width: auto;
	`}
	.body {
		border-width: 1px 1px 1px 1px;
		margin-top: 20px;
	}
	z-index: 100;
`;

const GasEditFields = styled.div`
	display: flex;
	width: 75px;
	justify-content: space-between;
	float: right;
	cursor: pointer;
`;

const StyledLinkTextSmall = styled(LinkTextSmall)<{ addPadding: boolean }>`
	padding-top: ${(props) => (props.addPadding ? '2px' : '0')};
`;

export default SelectCRatio;
