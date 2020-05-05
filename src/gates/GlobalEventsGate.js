import { useEffect } from 'react';
import { connect } from 'react-redux';
import snxData from 'synthetix-data';

import { updateRate } from '../ducks/rates';
import { bigNumberFormatter } from '../utils/formatters';

const GlobalEventsGate = ({ updateRate }) => {
	useEffect(() => {
		const ratesSubscription = snxData.rate.observe().subscribe({
			next(val) {
				const synth = val.synth;
				const rate = bigNumberFormatter(val.rate);

				updateRate({ synth, rate });
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
	updateRate,
};

export default connect(null, mapDispatchToProps)(GlobalEventsGate);
