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

export const SelectGasMenu = ({ gasPrice }: { gasPrice: number }) => {
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
					{pathname === ROUTES.Options.CreateMarketModal ||
					pathname === ROUTES.Assets.Options.CreateMarketModal ? (
						<PaddedLinkText>{t('common.actions.edit')}</PaddedLinkText>
					) : (
						<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
					)}
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

const PaddedLinkText = styled(LinkTextSmall)`
	padding-top: 2px;
`;

export default SelectGasMenu;
