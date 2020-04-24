import React from 'react';
import styled from 'styled-components';
import { CurrencyName } from './CurrencyName';

import { SYNTHS, CRYPTO_CURRENCY, FIAT_CURRENCY } from '../../../constants/currency';

export default {
	title: 'Currency/List',
};

export const synths = () => (
	<Container>
		{SYNTHS.map(currencyKey => (
			<CurrencyName key={currencyKey} currencyKey={currencyKey} />
		))}
	</Container>
);

export const crypto = () => (
	<Container>
		{CRYPTO_CURRENCY.map(currencyKey => (
			<CurrencyName key={currencyKey} currencyKey={currencyKey} />
		))}
	</Container>
);

export const fiat = () => (
	<Container>
		{FIAT_CURRENCY.map(currencyKey => (
			<CurrencyName key={currencyKey} currencyKey={currencyKey} />
		))}
	</Container>
);

const Container = styled.div`
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;
