import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { formatCurrency } from 'utils/formatters';

import { LinkTextSmall } from 'shared/commonStyles';
import { media } from 'shared/media';

import SelectGasMenuBody from './SelectGasMenuBody';

import { ROUTES } from 'constants/routes';
import DropdownPanel from 'components/DropdownPanel';

type SelectGasMenuProps = {
	gasPrice: number;
};

export const SelectGasMenu = ({ gasPrice }: SelectGasMenuProps) => {
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const [gasDropdownIsOpen, setGasDropdownIsOpen] = useState(false);
	const setDropdownIsOpen = (isOpen: boolean) => {
		if (!isOpen && !gasDropdownIsOpen) {
			return;
		}
		setGasDropdownIsOpen(isOpen);
	};

	return (
		<StyledDropdownPanel
			height="auto"
			isOpen={gasDropdownIsOpen}
			handleClose={() => setDropdownIsOpen(false)}
			width="170px"
			onHeaderClick={() => setDropdownIsOpen(!gasDropdownIsOpen)}
			header={
				<GasEditFields>
					<div>{formatCurrency(gasPrice) || 0}</div>
					<StyledLinkTextSmall
						addPadding={
							pathname === ROUTES.Options.CreateMarketModal ||
							pathname === ROUTES.Assets.Options.CreateMarketModal
						}
					>
						{t('common.actions.edit')}
					</StyledLinkTextSmall>
				</GasEditFields>
			}
			body={<SelectGasMenuBody setDropdownIsOpen={setDropdownIsOpen} />}
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

export default SelectGasMenu;
