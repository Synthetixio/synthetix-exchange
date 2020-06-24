import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Link from 'components/Link';

import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

import { getEtherscanTxLink } from 'utils/explorers';
import { RootState } from 'ducks/types';
import { getNetworkId } from 'ducks/wallet/walletDetails';
import { tableDataSmallCSS } from 'components/Typography/Table';

const mapStateToProps = (state: RootState) => ({
	networkId: getNetworkId(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type ViewLinkCellProps = PropsFromRedux & {
	isDisabled?: boolean;
	hash: string;
};

export const ViewLinkCell: FC<ViewLinkCellProps> = ({ isDisabled, networkId, hash, ...rest }) => {
	const { t } = useTranslation();

	return (
		<StyledLink isDisabled={isDisabled} to={getEtherscanTxLink(networkId, hash)} {...rest}>
			{t('common.transaction.view')}
			<ArrowIcon width="8" height="8" />
		</StyledLink>
	);
};

const StyledLink = styled(Link)<{ isDisabled?: boolean }>`
	color: ${(props) => props.theme.colors.hyperlink};
	${tableDataSmallCSS};
	/* flex: 150 0 auto;
	min-width: 0px;
	width: 150px; */
	${(props) =>
		props.isDisabled &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
	margin-left: 5px;
`;

export default connector(ViewLinkCell);
