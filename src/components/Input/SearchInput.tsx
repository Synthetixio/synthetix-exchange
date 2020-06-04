import React, { memo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ReactComponent as SearchIcon } from 'assets/images/search.svg';

import GenericInput from './Input';

type SearchInputProps = {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
	placeholder?: string;
	tabIndex?: number;
	autoFocus?: boolean;
};

export const SearchInput: FC<SearchInputProps> = memo(
	({ onChange, value, placeholder, tabIndex, autoFocus, ...rest }) => {
		const { t } = useTranslation();

		return (
			<Container {...rest}>
				<StyledSearchIcon />
				<StyledInput
					className="search-input"
					type="search"
					placeholder={placeholder || t('common.search')}
					onChange={onChange}
					value={value}
					tabIndex={tabIndex}
					autoFocus={autoFocus}
				/>
			</Container>
		);
	}
);

const Container = styled.div`
	position: relative;
`;

const StyledInput = styled(GenericInput)`
	height: 32px;
	border-radius: 1px;
	padding: 0 10px 0 25px;
	&::placeholder {
		text-transform: uppercase;
	}
`;

const StyledSearchIcon = styled(SearchIcon)`
	width: 12px;
	height: 12px;
	position: absolute;
	top: 50%;
	left: 10px;
	transform: translateY(-50%);
`;

export default SearchInput;
