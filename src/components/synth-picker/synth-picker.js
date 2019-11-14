import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import OutsideClickHandler from 'react-outside-click-handler';
import SynthPickerBox from './synth-picker-box';

import styles from './synth-picker.module.scss';

import {
	getCurrentWalletInfo,
	getAvailableSynths,
	getSynthToExchange,
	getExchangeRates,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';

class SynthPicker extends Component {
	constructor() {
		super();
		this.state = {
			popupIsActive: false,
		};
		this.togglePopup = this.togglePopup.bind(this);
		this.selectBaseSynth = this.selectBaseSynth.bind(this);
	}

	selectBaseSynth(synth) {
		const { setSynthToExchange } = this.props;
		return () => {
			if (!synth) return;
			setSynthToExchange(synth);
			this.setState({ popupIsActive: false });
		};
	}

	togglePopup() {
		const { popupIsActive } = this.state;
		this.setState({ popupIsActive: !popupIsActive });
	}

	renderPopup() {
		const { availableSynths, currentWalletInfo, exchangeRates } = this.props;
		const { popupIsActive } = this.state;
		if (!popupIsActive) return;
		return (
			<SynthPickerBox
				synths={availableSynths}
				balances={currentWalletInfo.balances}
				position={{ bottom: 0, left: 'calc(100% + 10px)' }}
				onSynthSelect={this.selectBaseSynth}
				exchangeRates={exchangeRates}
			/>
		);
	}

	render() {
		const { synthToExchange, currentWalletInfo } = this.props;
		const { balances } = currentWalletInfo;
		return (
			<OutsideClickHandler onOutsideClick={() => this.setState({ popupIsActive: false })}>
				<div className={styles.synthPickerWrapper}>
					<div className={styles.synthPicker}>
						<div className={styles.synthPickerValue} onClick={this.togglePopup}>
							<div>
								<img
									src={`/images/synths/${synthToExchange ? synthToExchange.name : 'sUSD'}-icon.svg`}
								/>
								{synthToExchange ? synthToExchange.name : 'sUSD'}
							</div>
							{balances ? (
								<div>
									{balances[synthToExchange.name]
										? numbro(Number(balances[synthToExchange.name])).format('0,0.00')
										: 0}{' '}
								</div>
							) : null}
						</div>
						{this.renderPopup()}
					</div>
				</div>
			</OutsideClickHandler>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentWalletInfo: getCurrentWalletInfo(state),
		availableSynths: getAvailableSynths(state),
		synthToExchange: getSynthToExchange(state),
		exchangeRates: getExchangeRates(state),
	};
};

const mapDispatchToProps = {
	setSynthToExchange,
};

SynthPicker.propTypes = {
	currentWalletInfo: PropTypes.object.isRequired,
	availableSynths: PropTypes.array.isRequired,
	synthToExchange: PropTypes.object,
	setSynthToExchange: PropTypes.func.isRequired,
	exchangeRates: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SynthPicker);
