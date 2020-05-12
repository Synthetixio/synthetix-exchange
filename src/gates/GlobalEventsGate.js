import { connect } from 'react-redux';
import snxData from 'synthetix-data';

import { updateRates } from '../ducks/rates';
import useInterval from 'src/shared/hooks/useInterval';

const RATE_UPDATES = 10000;

const GlobalEventsGate = ({ updateRates }) => {
	useInterval(() => {
		const getRates = async () => {
			try {
				// grab last 100 rate updates
				const rateUpdates = await snxData.rate.updates();

				updateRates({
					rates: rateUpdates.reverse().map(rateUpdate => ({
						synth: rateUpdate.synth,
						rate: rateUpdate.rate,
					})),
				});
			} catch (e) {
				console.error(e);
			}
		};

		getRates();
	}, RATE_UPDATES);

	return null;
};

const mapDispatchToProps = {
	updateRates,
};

export default connect(null, mapDispatchToProps)(GlobalEventsGate);
