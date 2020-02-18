import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatCurrency } from '../../../../../utils/formatters';
import { getTransactionPrice } from '../../../../../utils/networkUtils';

import { LinkTextSmall } from '../../../../../shared/commonStyles';
import { TextButton, FlexDivRow } from '../../../../../shared/commonStyles';

import { DataSmall } from '../../../../../components/Typography';

export const NetworkInfo = ({ gasPrice, gasLimit, ethRate, onEditButtonClick, className }) => {
	const { t } = useTranslation();

	return (
		<Container className={className}>
			<NetworkDataRow>
				<NetworkData>{t('common.gas-limit')}</NetworkData>
				<NetworkData>
					{formatCurrency(gasLimit, 0) || 0} ($
					{formatCurrency(getTransactionPrice(gasPrice, gasLimit, ethRate))})
				</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkData>{t('common.gas-price-gwei')}</NetworkData>
				<NetworkData>
					{gasPrice || 0}
					<ButtonEdit onClick={onEditButtonClick}>
						<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
					</ButtonEdit>
				</NetworkData>
			</NetworkDataRow>
		</Container>
	);
};

NetworkInfo.propTypes = {
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	ethRate: PropTypes.number,
	onEditButtonClick: PropTypes.func.isRequired,
};

export const Container = styled.div`
	margin: 18px 0;
`;

export const NetworkData = styled(DataSmall)`
	color: ${props => props.theme.colors.fontTertiary};
`;

export const NetworkDataRow = styled(FlexDivRow)`
	margin-bottom: 8px;
`;

export const ButtonEdit = styled(TextButton)`
	margin-left: 10px;
`;

export default NetworkInfo;
