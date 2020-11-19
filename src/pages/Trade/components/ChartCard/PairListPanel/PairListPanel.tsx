import React, { FC, useState, useEffect } from 'react';

import styled from 'styled-components';
import { connect } from 'react-redux';

import { CARD_HEIGHT } from 'constants/ui';
import { navigateToTrade } from 'constants/routes';

import { getSynthPair, SynthPair } from 'ducks/synths';
import { getMarketsAssetFilter, setMarketsAssetFilter, setBlurBackgroundIsVisible } from 'ducks/ui';
import { getFuturesMarkets, getAllMarkets, MarketPairs, MarketPair } from 'ducks/markets';

import { ReactComponent as MenuArrowDownIcon } from 'assets/images/menu-arrow-down.svg';

import DropdownPanel from 'components/DropdownPanel';
import Currency from 'components/Currency';

import { FlexDiv } from 'shared/commonStyles';
import { RootState } from 'ducks/types';

import MarketsTable from './MarketsTable';

type StateProps = {
	synthPair: SynthPair;
	marketsByQuote: MarketPairs;
	allMarkets: MarketPairs;
	marketsAssetFilter: string;
};

type DispatchProps = {
	setMarketsAssetFilter: typeof setMarketsAssetFilter;
	setBlurBackgroundIsVisible: typeof setBlurBackgroundIsVisible;
};

type PairListPanelProps = StateProps & DispatchProps;

const PairListPanel: FC<PairListPanelProps> = ({
	synthPair: { base, quote },
	marketsByQuote,
	setBlurBackgroundIsVisible,
}) => {
	const [pairListDropdownIsOpen, setPairListDropdownIsOpen] = useState<boolean>(false);

	const toggleDropdown = (isOpen: boolean) => {
		if (!isOpen && !pairListDropdownIsOpen) return;

		setPairListDropdownIsOpen(isOpen);
		setBlurBackgroundIsVisible(isOpen);
	};

	useEffect(() => {
		return () => {
			setBlurBackgroundIsVisible(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DropdownPanel
			isOpen={pairListDropdownIsOpen}
			handleClose={() => toggleDropdown(false)}
			onHeaderClick={() => toggleDropdown(!pairListDropdownIsOpen)}
			width="300px"
			header={
				<DropdownPanelHeader>
					<Currency.Pair
						baseCurrencyKey={base.name}
						quoteCurrencyKey={quote.name}
						showIcon={true}
					/>
					<MenuArrowDownIcon className="arrow" />
				</DropdownPanelHeader>
			}
			body={
				<PairListContainer>
					<MarketsTable
						markets={marketsByQuote}
						onTableRowClick={(row: { original: MarketPair }) => {
							navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey);
							toggleDropdown(false);
						}}
					/>
				</PairListContainer>
			}
		/>
	);
};

const PairListContainer = styled.div`
	height: 100%;
	padding-bottom: 12px;
`;

const DropdownPanelHeader = styled(FlexDiv)`
	width: 100%;
	justify-content: space-between;
	align-items: center;
	height: ${CARD_HEIGHT};
	padding: 0 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthPair: getSynthPair(state),
	marketsByQuote: getFuturesMarkets(state),
	allMarkets: getAllMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps: DispatchProps = {
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(PairListPanel);
