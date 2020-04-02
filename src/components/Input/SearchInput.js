import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactComponent as SearchIcon } from 'src/assets/images/search.svg';

import GenericInput from './Input';

export const SearchInput = memo(({ onChange, value, ...rest }) => {
	const { t } = useTranslation();
	return (
		<Container {...rest}>
			<StyledSearchIcon />
			<StyledInput placeholder={t('common.search')} onChange={onChange} value={value} />
		</Container>
	);
});

SearchInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
};

const Container = styled.div`
	position: relative;
`;

const StyledInput = styled(GenericInput)`
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
