import React, { memo, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DataSmall } from 'src/components/Typography';
import { TRANSACTION_STATUS } from 'src/constants/transaction';

const OrderStatusLabel = memo(({ status }) => {
	const { t } = useTranslation();
	const { colors } = useContext(ThemeContext);
	let labelColor = '';
	switch (status) {
		case TRANSACTION_STATUS.CANCELLED:
		case TRANSACTION_STATUS.FAILED:
			labelColor = colors.red;
			break;
		case TRANSACTION_STATUS.PENDING:
			labelColor = colors.fontTertiary;
			break;
		case TRANSACTION_STATUS.CONFIRMED:
			labelColor = colors.green;
			break;
		default:
			labelColor = colors.fontTertiary;
	}
	return <DataLabel color={labelColor}>{t(`common.tx-status.${status}`)}</DataLabel>;
});

const DataLabel = styled(DataSmall)`
	text-transform: capitalize;
`;

export default OrderStatusLabel;
