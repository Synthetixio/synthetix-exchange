import React, { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';

import { RootState } from 'ducks/types';
import get from 'lodash/get';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import Currency from 'components/Currency';
import Card from 'components/Card';
import { HeadingSmall } from 'components/Typography';
import { Button } from 'components/Button';
import Link from 'components/Link';

import { TableNoResults } from 'shared/commonStyles';

import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatCurrency,
	formatCurrencyWithSign,
} from 'utils/formatters';

import { getAvailableSynthsMap, SynthDefinitionMap } from 'ducks/synths';
import {
	getSynthsWalletBalances,
	getIsRefreshingWalletBalances,
	getIsLoadedWalletBalances,
	getIsFetchingWalletBalances,
} from 'ducks/wallet/walletBalances';

import {
	CRYPTO_CURRENCY_MAP,
	SYNTHS_MAP,
	BASE_TRADING_PAIRS,
	CurrencyKey,
	getMarketPairByMC,
} from 'constants/currency';
import { LINKS } from 'constants/links';
import Spinner from 'components/Spinner';
import { buildTradeLink } from 'constants/routes';
import { BigNumberish } from 'ethers/utils';

type SynthWalletBalance = {
	balance: number;
	balanceBN: BigNumberish;
	name: CurrencyKey;
	portfolioPercent: number;
	usdBalance: number;
};

type StateProps = {
	synthsWalletBalances: SynthWalletBalance[];
	isLoadedWalletBalances: boolean;
	isRefreshingWalletBalances: boolean;
	isFetchingWalletBalances: boolean;
	synthsMap: SynthDefinitionMap;
};

type YourSynthsProps = StateProps;

export const YourSynths: FC<YourSynthsProps> = memo(
	({
		synthsWalletBalances,
		isLoadedWalletBalances,
		isRefreshingWalletBalances,
		isFetchingWalletBalances,
		synthsMap,
	}) => {
		const { t } = useTranslation();
		const [selectedSynth, setSelectedSynth] = useState<CurrencyKey | null>(null);
		const [tradeButtonAnchorEl, setTradeButtonAnchorEl] = useState<HTMLButtonElement | null>(null);

		const handleTradeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setTradeButtonAnchorEl(event.currentTarget);
		};

		const handleTradePopoverClose = () => {
			setTradeButtonAnchorEl(null);
			setSelectedSynth(null);
		};

		const tradeButtonPopoverOpen = Boolean(tradeButtonAnchorEl);
		const id = tradeButtonPopoverOpen ? 'trade-button-popover' : undefined;

		return (
			<>
				<StyledCard>
					<Card.Header>
						<HeadingSmall>{t('assets.overview.your-synths.title')}</HeadingSmall>
						{isRefreshingWalletBalances && <Spinner size="sm" />}
					</Card.Header>
					<StyledCardBody>
						<Table
							palette={TABLE_PALETTE.STRIPED}
							columns={[
								{
									Header: t('assets.overview.your-synths.table.asset-col'),
									accessor: 'name',
									Cell: (cellProps: { cell: { value: SynthWalletBalance['name'] } }) => (
										<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
									),
									width: 150,
									sortable: true,
								},
								{
									Header: t('assets.overview.your-synths.table.asset-description-col'),
									id: 'asset-desc',
									Cell: (cellProps: { row: { original: SynthWalletBalance } }) => {
										const currencyKey = cellProps.row.original.name;

										return (
											<span>
												{t('common.currency.synthetic-currency', {
													currencyKey: get(synthsMap, [currencyKey, 'desc']),
												})}
											</span>
										);
									},
									width: 150,
								},
								{
									Header: t('assets.overview.your-synths.table.total-col'),
									accessor: 'balance',
									sortType: 'basic',
									Cell: (cellProps: { cell: { value: SynthWalletBalance['balance'] } }) => (
										<Tooltip
											title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
											placement="top"
										>
											<span>
												{formatCurrency(cellProps.cell.value, SHORT_CRYPTO_CURRENCY_DECIMALS)}
											</span>
										</Tooltip>
									),
									width: 150,
									sortable: true,
								},
								{
									Header: t('assets.overview.your-synths.table.usd-value-col'),
									accessor: 'usdBalance',
									sortType: 'basic',
									Cell: (cellProps: { cell: { value: SynthWalletBalance['usdBalance'] } }) => (
										<span>
											{formatCurrencyWithSign(
												get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
												cellProps.cell.value
											)}
										</span>
									),
									width: 150,
									sortable: true,
								},
								{
									Header: t('assets.overview.your-synths.table.actions-col'),
									accessor: 'actions',
									width: 250,
									Cell: (cellProps: { row: { original: SynthWalletBalance } }) => {
										const currencyKey = cellProps.row.original.name;

										return (
											<ActionsCol>
												<Link to={LINKS.Tokens} isExternal={true}>
													<Button palette="primary" size="xs" disabled={true}>
														{t('common.actions.info')}
													</Button>
												</Link>
												<Button
													palette="primary"
													size="xs"
													onClick={(e) => {
														handleTradeButtonClick(e);
														setSelectedSynth(currencyKey);
													}}
												>
													{t('common.actions.trade')}
												</Button>
												{[SYNTHS_MAP.sUSD, SYNTHS_MAP.sETH].includes(currencyKey) && (
													<Link
														to={LINKS.Trading.OneInchLink(currencyKey, CRYPTO_CURRENCY_MAP.ETH)}
														isExternal={true}
													>
														<Button palette="primary" size="xs">
															{t('common.actions.swap-via-1inch')}
														</Button>
													</Link>
												)}
											</ActionsCol>
										);
									},
								},
							]}
							data={synthsWalletBalances}
							noResultsMessage={
								isLoadedWalletBalances && synthsWalletBalances.length === 0 ? (
									<TableNoResults>
										{t('assets.overview.your-synths.table.no-results')}
									</TableNoResults>
								) : undefined
							}
							isLoading={isFetchingWalletBalances && !isLoadedWalletBalances}
						/>
					</StyledCardBody>
				</StyledCard>
				<StyledPopover
					classes={{
						paper: 'paper',
					}}
					id={id}
					open={tradeButtonPopoverOpen}
					anchorEl={tradeButtonAnchorEl}
					onClose={handleTradePopoverClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
				>
					<PopoverContent>
						{selectedSynth &&
							BASE_TRADING_PAIRS.filter((quote) => quote !== selectedSynth).map((quote) => {
								const { base: baseCurrencyKey, quote: quoteCurrencyKey } = getMarketPairByMC(
									selectedSynth,
									quote
								);

								return (
									<Link
										to={buildTradeLink(baseCurrencyKey, quoteCurrencyKey)}
										key={`${selectedSynth}-${quote}`}
									>
										<Currency.Pair
											key={quote}
											baseCurrencyKey={baseCurrencyKey}
											quoteCurrencyKey={quoteCurrencyKey}
										/>
									</Link>
								);
							})}
					</PopoverContent>
				</StyledPopover>
			</>
		);
	}
);

const ActionsCol = styled.div`
	display: inline-grid;
	grid-gap: 11px;
	grid-auto-flow: column;
`;

const StyledCard = styled(Card)`
	flex-grow: 1;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
	position: relative;
`;

const StyledPopover = styled(Popover)`
	margin-top: 8px;

	.paper {
		box-shadow: 0px 1px 4px rgba(14, 13, 20, 0.8);
		border-radius: 0;
		border: 1px solid ${({ theme }) => theme.colors.accentL1};
	}
`;

const PopoverContent = styled.div`
	display: grid;
	background-color: ${({ theme }) => theme.colors.surfaceL3};
	> * {
		padding: 10px 15px;
		&:hover {
			background-color: ${({ theme }) => theme.colors.accentL1};
		}
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	isRefreshingWalletBalances: getIsRefreshingWalletBalances(state),
	isFetchingWalletBalances: getIsFetchingWalletBalances(state),
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
});

export default connect(mapStateToProps)(YourSynths);
