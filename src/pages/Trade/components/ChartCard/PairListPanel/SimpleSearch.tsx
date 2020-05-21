import React, { memo, FC } from 'react';
import styled from 'styled-components';

import { SYNTHS_MAP, CurrencyKey, CurrencyKeys } from 'constants/currency';

import { ReactComponent as CogIcon } from 'assets/images/cog.svg';

import { SearchInput } from 'components/Input';

import { StyledButton, IconButton } from './common';

const ASSET_FILTERS: CurrencyKeys = [SYNTHS_MAP.sUSD, SYNTHS_MAP.sBTC, SYNTHS_MAP.sETH];

type SimpleSearchProps = {
	search: string;
	marketsAssetFilter: CurrencyKey;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAssetFilterClick: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		asset: CurrencyKey
	) => void;
	onAdvancedSearchClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const SimpleSearch: FC<SimpleSearchProps> = memo(
	({ marketsAssetFilter, onSearchChange, onAdvancedSearchClick, search, onAssetFilterClick }) => (
		<>
			<SearchInput value={search} onChange={onSearchChange} />
			<ButtonsRow>
				{ASSET_FILTERS.map((asset) => (
					<StyledButton
						key={`button-filter-${asset}`}
						isActive={asset === marketsAssetFilter}
						onClick={(e) => onAssetFilterClick(e, asset)}
					>
						{asset}
					</StyledButton>
				))}
				<IconButton onClick={onAdvancedSearchClick}>
					<CogIcon />
				</IconButton>
			</ButtonsRow>
		</>
	)
);

const ButtonsRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr auto;
	grid-gap: 8px;
`;

export default SimpleSearch;
