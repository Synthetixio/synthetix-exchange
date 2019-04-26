import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import OutsideClickHandler from 'react-outside-click-handler';

import styles from './synth-picker.module.scss';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';

class SynthPicker extends Component {
  constructor() {
    super();
    this.state = {
      popupIsActive: false,
      currentTab: 'crypto',
    };
    this.togglePopup = this.togglePopup.bind(this);
    this.selectTab = this.selectTab.bind(this);
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

  selectTab(tab) {
    return () => {
      this.setState({ currentTab: tab });
    };
  }

  renderSynths() {
    const { availableSynths, currentWalletInfo } = this.props;
    const { balances } = currentWalletInfo;
    const { currentTab } = this.state;
    const filteredSynths = availableSynths.filter(synth => {
      return (
        (!balances ||
          (balances && balances[synth.name] && balances[synth.name] > 0)) &&
        synth.category === currentTab
      );
    });
    return (
      <div className={styles.synthTableBody}>
        {filteredSynths.length > 0 ? (
          filteredSynths.map(synth => {
            return (
              <div
                className={styles.synthWrapper}
                onClick={this.selectBaseSynth(synth)}
              >
                <img src={`/images/synths/${synth.name}-icon.svg`} />
                <span>{synth.name}</span>
              </div>
            );
          })
        ) : (
          <div>No synths</div>
        )}
      </div>
    );
  }

  renderPopup() {
    const { popupIsActive, currentTab } = this.state;
    if (!popupIsActive) return;
    return (
      <div className={styles.synthPickerBox}>
        <div className={styles.synthTable}>
          <div className={styles.synthTableHeader}>
            {['crypto', 'commodity', 'forex'].map(category => {
              return (
                <button
                  onClick={this.selectTab(category)}
                  className={`${styles.synthTableButton} ${
                    currentTab === category
                      ? styles.synthTableButtonIsActive
                      : ''
                  }`}
                >
                  {category === 'commodity' ? 'Commodities' : category}
                </button>
              );
            })}
          </div>
          {this.renderSynths()}
        </div>
      </div>
    );
  }

  render() {
    const { synthToExchange, currentWalletInfo } = this.props;
    const { balances } = currentWalletInfo;
    return (
      <OutsideClickHandler
        onOutsideClick={() => this.setState({ popupIsActive: false })}
      >
        <div className={styles.synthPickerWrapper}>
          <div className={styles.synthPicker}>
            <div className={styles.synthPickerValue} onClick={this.togglePopup}>
              <div>
                <img
                  src={`/images/synths/${
                    synthToExchange ? synthToExchange.name : 'sUSD'
                  }-icon.svg`}
                />
                {synthToExchange ? synthToExchange.name : 'sUSD'}
              </div>
              {balances ? (
                <div>
                  {balances[synthToExchange.name]
                    ? numbro(Number(balances[synthToExchange.name])).format(
                        '0,0.00'
                      )
                    : 0}{' '}
                </div>
              ) : null}
            </div>
            {this.renderPopup()}
          </div>
          <button
            className={styles.selectSynthButton}
            onClick={this.togglePopup}
          >
            Select Base Synth
          </button>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynthPicker);
