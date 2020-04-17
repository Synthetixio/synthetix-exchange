import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import Tooltip from '@material-ui/core/Tooltip';

import { resetWalletReducer, getCurrentWalletAddress } from 'src/ducks/wallet/walletDetails';
import {
	getTotalSynthsBalanceUSD,
	getIsLoadedWalletBalances,
	getSynthsWalletBalances,
	getIsFetchingWalletBalances,
} from 'src/ducks/wallet/walletBalances';
import { showWalletPopup } from 'src/ducks/ui';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { FIAT_CURRENCY_MAP, SYNTHS_MAP } from 'src/constants/currency';
import { EMPTY_VALUE } from 'src/constants/placeholder';

import {
	formatCurrencyWithSign,
	formatCurrency,
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
} from 'src/utils/formatters';

import Card from 'src/components/Card';
import { HeadingSmall, DataMedium } from 'src/components/Typography';
import { gradientTextCSS, TableNoResults } from 'src/shared/commonStyles';
import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';

const WalletMenu = ({
	totalSynthsBalanceUSD,
	isLoadedWalletBalances,
	synthsMap,
	synthsWalletBalances,
	isFetchingWalletBalances,
}) => {
	const { t } = useTranslation();

	return (
		<Content>
			<Card>
				<Card.Header>
					<StyledHeadingSmall>asset value</StyledHeadingSmall>
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
					<StyledHeadingSmall>leaderboard ranking</StyledHeadingSmall>
				</Card.Header>
				<Card.Body>
					<CardData>
						<GreenGradient>#1</GreenGradient>
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
	font-size: 12px;
	line-height: 15px;
`;

const CardData = styled(DataMedium)`
	color: ${(props) => props.theme.colors.fontPrimary};
	text-transform: uppercase;
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
`;

const StyleCardBody = styled(Card.Body)`
	padding: 0;
`;

const GreenGradient = styled.span`
	background: -webkit-linear-gradient(353.8deg, #00e2df 4.3%, #bff360 94.52%);
	${gradientTextCSS};
	-webkit-text-stroke: 1px #43eeec;
	text-shadow: 0px 0px 20px rgba(255, 164, 235, 0.3);
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
