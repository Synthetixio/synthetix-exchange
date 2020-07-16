import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';
import { ReactComponent as ReverseArrowIcon } from 'assets/images/reverse-arrow.svg';

import SearchInput from 'components/Input/SearchInput';

import { IconButton } from './common';

type AdvancedSearchProps = {
	baseCurrencySearch: string;
	onBaseCurrencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	quoteCurrencySearch: string;
	onQuoteCurrencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClose: () => void;
	onSwapCurrencies: () => void;
};

const AdvancedSearch: FC<AdvancedSearchProps> = ({
	onClose,
	baseCurrencySearch,
	onBaseCurrencyChange,
	quoteCurrencySearch,
	onQuoteCurrencyChange,
	onSwapCurrencies,
}) => {
	const { t } = useTranslation();

	return (
		<>
			<SearchContainer>
				<SearchInput
					value={baseCurrencySearch}
					onChange={onBaseCurrencyChange}
					placeholder={t('common.buy')}
					tabIndex={1}
					autoFocus={true}
				/>
				<IconButton onClick={onSwapCurrencies}>
					<ReverseArrowIcon />
				</IconButton>
			</SearchContainer>
			<SearchContainer>
				<SearchInput
					value={quoteCurrencySearch}
					onChange={onQuoteCurrencyChange}
					placeholder={t('common.sell')}
					tabIndex={2}
				/>
				<IconButton onClick={onClose}>
					<CloseCrossIcon width="10px" height="10px" />
				</IconButton>
			</SearchContainer>
		</>
	);
};

const SearchContainer = styled.div`
	display: grid;
	grid-gap: 12px;
	grid-template-columns: 1fr auto;
`;

export default AdvancedSearch;
