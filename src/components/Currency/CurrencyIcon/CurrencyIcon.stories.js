import React from 'react';
import styled from 'styled-components';
import { CurrencyIcon } from './CurrencyIcon';

import { SYNTHS, CRYPTO_CURRENCY, FIAT_CURRENCY } from '../../../constants/currency';

export default {
	title: 'Currency/Icons',
};

export const synths = () => (
	<Container>
		{SYNTHS.map(currencyKey => (
			<CurrencyIcon key={currencyKey} currencyKey={currencyKey} width="50" height="50" />
		))}
	</Container>
);

export const crypto = () => (
	<Container>
		{CRYPTO_CURRENCY.map(currencyKey => (
			<CurrencyIcon key={currencyKey} currencyKey={currencyKey} width="50" height="50" />
		))}
	</Container>
);

export const fiat = () => (
	<Container>
		{FIAT_CURRENCY.map(currencyKey => (
			<CurrencyIcon key={currencyKey} currencyKey={currencyKey} width="50" height="50" />
		))}
	</Container>
);

const Container = styled.div`
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;
