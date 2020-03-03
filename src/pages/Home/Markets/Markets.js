import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import produce from 'immer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import snxData from 'synthetix-data';
import orderBy from 'lodash/orderBy';

import { EMPTY_BALANCE } from '../../../constants/placeholder';
import Spinner from '../../../components/Spinner';

import { getAvailableSynthsMap } from '../../../ducks/synths';
import { getRatesExchangeRates } from '../../../ducks/rates';

import { getExchangeRatesForCurrencies } from '../../../utils/rates';

import {
	fetchSynthRateUpdates,
	fetchSynthVolumeInUSD,
	PERIOD_IN_HOURS,
} from '../../../services/rates/rates';

import { PAIRS } from './constants';

import MarketsTable from './MarketsTable';
import MarketsCharts from './MarketsCharts';

export const Markets = ({ exchangeRates, synthsMap }) => {
	const [synthsRates, setSynthsRates] = useState([]);
	const [isLoadedSynthRates, setLoadedSynthRates] = useState(false);

	useEffect(() => {
		const exchangesSubscription = snxData.exchanges.observe().subscribe({
			next(data) {
				if (isLoadedSynthRates) {
					const synthIndex = synthsRates.findIndex(
						synth =>
							data.fromCurrencyKey === synth.quoteCurrencyKey &&
							data.toCurrencyKey === synth.baseCurrencyKey
					);
					if (synthIndex != -1) {
						setSynthsRates(
							produce(synthsRates, draftState => {
								draftState[synthIndex].rates24hVol += data.fromAmountInUSD;
							})
						);
					}
				}
			},
		});

		const fetchSynthRates = async () => {
			const synths = [];

			for (const pair of PAIRS) {
				const { baseCurrencyKey, quoteCurrencyKey } = pair;
				const rates24H = await fetchSynthRateUpdates(
					baseCurrencyKey,
					quoteCurrencyKey,
					PERIOD_IN_HOURS.ONE_DAY
				);
				const volume24H = await fetchSynthVolumeInUSD(
					baseCurrencyKey,
					quoteCurrencyKey,
					PERIOD_IN_HOURS.ONE_DAY
				);

				synths.push({
					pair: `${baseCurrencyKey}-${quoteCurrencyKey}`,
					baseCurrencyKey,
					quoteCurrencyKey,
					lastPrice: EMPTY_BALANCE,
					rates: rates24H.rates,
					rates24hChange: rates24H.change,
					rates24hLow: rates24H.low,
					rates24hHigh: rates24H.high,
					rates24hVol: volume24H,
				});
			}
			setSynthsRates(orderBy(synths, 'rates24hVol', 'desc'));
			setLoadedSynthRates(true);
		};

		fetchSynthRates();
		return () => {
			exchangesSubscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isLoadedSynthRates && exchangeRates != null) {
			setSynthsRates(
				synthsRates.map(synth => ({
					...synth,
					lastPrice:
						getExchangeRatesForCurrencies(
							exchangeRates,
							synth.baseCurrencyKey,
							synth.quoteCurrencyKey
						) || 0,
				}))
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exchangeRates, isLoadedSynthRates]);

	if (!isLoadedSynthRates) {
		return <Spinner size="sm" fullscreen={true} />;
	}

	return (
		<Container>
			<Section>
				<MarketsCharts synthsRates={synthsRates} synthsMap={synthsMap} />
				<MarketsTable synthsRates={synthsRates} synthsMap={synthsMap} />
			</Section>
		</Container>
	);
};

Markets.propTypes = {
	exchangeRates: PropTypes.object,
	synthsMap: PropTypes.object,
};

const Container = styled.div`
	background-color: ${props => props.theme.colors.white};
`;

const Section = styled.div`
	max-width: 1300px;
	margin: 0 auto;
`;

const mapStateToProps = state => ({
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps, null)(Markets);
