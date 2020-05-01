import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import Tooltip from '@material-ui/core/Tooltip';

import { resetWalletReducer, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import {
	getTotalSynthsBalanceUSD,
	getIsLoadedWalletBalances,
	getSynthsWalletBalances,
	getIsFetchingWalletBalances,
} from 'ducks/wallet/walletBalances';
import { showWalletPopup } from 'ducks/ui';
import { getAvailableSynthsMap } from 'ducks/synths';

import { ROUTES } from 'constants/routes';
import { FIAT_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';

import {
	shortenAddress,
	formatCurrencyWithSign,
	formatCurrency,
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
} from 'utils/formatters';

import Card from 'components/Card';
import { ButtonPrimaryExtraSmall, ButtonPrimarySmall } from 'components/Button/ButtonPrimary';
import { HeadingSmall, DataMedium } from 'components/Typography';
import { InfoBoxLabel, FlexDivCentered, TableNoResults } from 'shared/commonStyles';
import Link from 'components/Link';
import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import Currency from 'components/Currency';

const WalletMenu = ({
	resetWalletReducer,
	setDropdownIsOpen,
	currentWallet,
	showWalletPopup,
	totalSynthsBalanceUSD,
	isLoadedWalletBalances,
	synthsMap,
	synthsWalletBalances,
	isFetchingWalletBalances,
}) => {
	const { t } = useTranslation();

	const logout = () => {
		resetWalletReducer();
		setDropdownIsOpen(false);
	};

	return (
		<Content>
			<Card>
				<Card.Header>
					<StyledHeadingSmall>{t('header.wallet-menu.cards.wallet-details')}</StyledHeadingSmall>
				</Card.Header>
				<Card.Body>
					<StyledFlexCentered>
						<InfoBoxLabel>{t('header.wallet-menu.cards.account')}</InfoBoxLabel>
						<ButtonPrimaryExtraSmall onClick={() => showWalletPopup()}>
							{t('header.wallet-menu.buttons.change')}
						</ButtonPrimaryExtraSmall>
					</StyledFlexCentered>
					<CardData>{shortenAddress(currentWallet)}</CardData>
				</Card.Body>
			</Card>
			<Card>
				<Card.Header>
					<StyledHeadingSmall>
						{t('header.wallet-menu.cards.estimated-wallet-value')}
					</StyledHeadingSmall>
				</Card.Header>
				<Card.Body>
					<CardData>
						{isLoadedWalletBalances
							? `${formatCurrencyWithSign(
									get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
									totalSynthsBalanceUSD
							  )} ${FIAT_CURRENCY_MAP.USD}`
							: EMPTY_VALUE}
					</CardData>
				</Card.Body>
			</Card>
			<Card>
				<Card.Header>
					<StyledHeadingSmall>{t('header.wallet-menu.cards.synth-balance')}</StyledHeadingSmall>
				</Card.Header>
				<StyleCardBody>
					<StyledTable
						palette={TABLE_PALETTE.STRIPED}
						data={synthsWalletBalances}
						noResultsMessage={
							isLoadedWalletBalances && synthsWalletBalances.length === 0 ? (
								<TableNoResults>{t('assets.overview.your-synths.table.no-results')}</TableNoResults>
							) : undefined
						}
						isLoading={isFetchingWalletBalances && !isLoadedWalletBalances}
						columns={[
							{
								Header: t('assets.overview.your-synths.table.asset-col'),
								accessor: 'name',
								Cell: (cellProps) => (
									<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
								),
								width: 100,
								sortable: true,
							},

							{
								Header: t('assets.overview.your-synths.table.total-col'),
								accessor: 'balance',
								sortType: 'basic',
								Cell: (cellProps) => (
									<Tooltip
										title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
										placement="top"
									>
										<span>
											{formatCurrency(cellProps.cell.value, SHORT_CRYPTO_CURRENCY_DECIMALS)}
										</span>
									</Tooltip>
								),
								width: 100,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-synths.table.usd-value-col'),
								accessor: 'usdBalance',
								sortType: 'basic',
								Cell: (cellProps) => (
									<span>
										{formatCurrencyWithSign(
											get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
											cellProps.cell.value
										)}
									</span>
								),
								width: 100,
								sortable: true,
							},
						]}
					></StyledTable>
				</StyleCardBody>
			</Card>
			<Bottom>
				<Link to={ROUTES.Assets.Home}>
					<StyledButton>{t('header.wallet-menu.buttons.wallet-overview')}</StyledButton>
				</Link>
				<StyledButton onClick={logout}>{t('header.wallet-menu.buttons.log-out')}</StyledButton>
			</Bottom>
		</Content>
	);
};

const StyledTable = styled(Table)`
	.table-row {
		width: 100%;
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		width: 300px;
		height: 256px;
		overflow-x: hidden;
	}
	.table-body-row {
		& > :first-child {
			padding-left: 12px;
		}
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body-cell {
		height: 32px;
	}
`;

const Content = styled.div`
	width: 100%;
	height: 100%;
`;

const StyledHeadingSmall = styled(HeadingSmall)`
	font-size: 10px;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const Bottom = styled.div`
	padding: 0 8px 8px 8px;
	margin-top: 16px;
	display: flex;
	flex-direction: column;
	& > * + * {
		margin-top: 12px;
	}
`;

const StyledButton = styled(ButtonPrimarySmall)`
	width: 100%;
`;

const CardData = styled(DataMedium)`
	color: ${(props) => props.theme.colors.fontPrimary};
	text-transform: uppercase;
`;

const StyleCardBody = styled(Card.Body)`
	padding: 0;
`;

const StyledFlexCentered = styled(FlexDivCentered)`
	justify-content: space-between;
`;

const mapStateToProps = (state) => ({
	currentWallet: getCurrentWalletAddress(state),
	totalSynthsBalanceUSD: getTotalSynthsBalanceUSD(state),
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
	synthsMap: getAvailableSynthsMap(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	isFetchingWalletBalances: getIsFetchingWalletBalances(state),
});

const mapDispatchToProps = {
	resetWalletReducer,
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletMenu);
