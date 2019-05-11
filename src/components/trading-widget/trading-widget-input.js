import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';

import SynthPickerBox from '../synth-picker/synth-picker-box';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getCurrentExchangeMode,
} from '../../ducks/';

import styles from './trading-widget.module.scss';

class TradingWidgetInput extends Component {
  constructor() {
    super();
    this.state = {
      boxIsOpen: false,
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.onSynthSelect = this.onSynthSelect.bind(this);
  }

  toggleBox() {
    const { boxIsOpen } = this.state;
    this.setState({ boxIsOpen: !boxIsOpen });
  }

  onSynthSelect(synth) {
    return () => {
      const { onSynthSelect } = this.props;
      onSynthSelect(synth);
      this.setState({ boxIsOpen: false });
    };
  }

  render() {
    const {
      value,
      onInputChange,
      currentSynth,
      availableSynths,
      currentWalletInfo,
      filterNotNeeded,
      currentExchangeMode,
    } = this.props;
    const { boxIsOpen } = this.state;
    const balances = currentWalletInfo.balances;
    return (
      <div className={styles.widgetInputWrapper}>
        <OutsideClickHandler
          onOutsideClick={() => this.setState({ boxIsOpen: false })}
        >
          <input
            className={`${styles.widgetInputElement} ${
              currentExchangeMode === 'basic'
                ? styles.widgetInputElementBig
                : ''
            }`}
            type="text"
            value={value || ''}
            placeholder={0}
            onChange={onInputChange}
            pattern="^-?[0-9]\d*\.?\d*$"
          />
          <div
            className={`${styles.widgetInputSynth} ${
              currentExchangeMode === 'basic' ? styles.widgetInputSynthBig : ''
            }`}
            onClick={this.toggleBox}
          >
            <div className={styles.widgetInputInner}>
              <img
                className={styles.inputSynthImage}
                src={`images/synths/${currentSynth}-icon.svg`}
                alt="synth icon"
              />
              <span>{currentSynth}</span>
            </div>
            {currentExchangeMode === 'basic' ? (
              <div className={styles.widgetInputInner}>
                <img
                  className={styles.inputOpenDropdownIcon}
                  src="/images/angle-down-icon.svg"
                />
              </div>
            ) : null}
          </div>
          {boxIsOpen ? (
            <SynthPickerBox
              synths={availableSynths}
              balances={balances}
              position={{ top: 'calc(100% + 10px)', right: 0 }}
              onSynthSelect={this.onSynthSelect}
              filterNotNeeded={filterNotNeeded}
            />
          ) : null}
        </OutsideClickHandler>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    currentExchangeMode: getCurrentExchangeMode(state),
  };
};

const mapDispatchToProps = {};

TradingWidgetInput.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  currentSynth: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  availableSynths: PropTypes.array,
  currentExchangeMode: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingWidgetInput);
