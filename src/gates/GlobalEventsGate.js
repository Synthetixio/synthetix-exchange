import { useEffect } from 'react';
import { connect } from 'react-redux';
import snxData from 'synthetix-data';
import { debounceReduce } from 'src/utils/mixins';

import { updateRates } from '../ducks/rates';
import { bigNumberFormatter } from '../utils/formatters';

const DEBOUNCE_TIMEOUT = 3000;

const GlobalEventsGate = ({ updateRates }) => {
	useEffect(() => {
		const batchedUpdateRate = debounceReduce(
			(...args) => {
				updateRates({ rates: args });
			},
			DEBOUNCE_TIMEOUT,
			(acc = [], args = []) => [...acc, ...args]
		);

		const ratesSubscription = snxData.rate.observe().subscribe({
			next(val) {
				const synth = val.synth;
				const rate = bigNumberFormatter(val.rate);

				batchedUpdateRate({ synth, rate });
			},
		});

		return () => {
			ratesSubscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

const mapDispatchToProps = {
	updateRates,
};

export default connect(null, mapDispatchToProps)(GlobalEventsGate);
