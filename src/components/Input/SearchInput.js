import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';

import GenericInput from './Input';

const Input = ({ onChange, value, t }) => (
	<Container>
		<StyledSearchIcon />
		<GenericInput
			padding="0 10px 0 25px"
			placeholder={`${t('common.search')}...`}
			onChange={onChange}
			value={value}
		></GenericInput>
	</Container>
);

const Container = styled.div`
	width: 100%;
	position: relative;
`;

const StyledSearchIcon = styled(SearchIcon)`
	width: 12px;
	height: 12px;
	position: absolute;
	top: 50%;
	left: 10px;
	transform: translateY(-50%);
`;

export default withTranslation()(Input);
