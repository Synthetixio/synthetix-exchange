import React, { Component } from 'react';
import styles from './synth-picker.module.scss';
import numbro from 'numbro';

class SynthPickerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: props.filterNotNeeded || false,
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  }

  renderSynths() {
    const { synths, balances, onSynthSelect, exchangeRates } = this.props;
    const { showAll } = this.state;
    const filteredSynths = synths.filter(synth => {
      const rate = exchangeRates && exchangeRates[synth.name];
      const isDust =
        balances &&
        balances[synth.name] &&
        rate &&
        Number(balances[synth.name]) * rate['sUSD'] <= 0.01;
      return (
        ['crypto', 'forex', 'commodity', 'index'].includes(synth.category) &&
        (showAll ? true : !isDust)
      );
    });
    return (
      <div>
        <div className={styles.synthPickerBoxHeader}>
          {balances ? (
            <button
              className={styles.synthPickerBoxButton}
              onClick={this.toggleShowAll}
            >
              {showAll ? 'Hide Dust' : 'Show All'}
            </button>
          ) : null}
        </div>
        <div className={styles.synthTableBody}>
          {filteredSynths.map(synth => {
            return (
              <div
                key={synth.name}
                className={styles.synthWrapper}
                onClick={onSynthSelect(synth)}
              >
                <img src={`/images/synths/${synth.name}-icon.svg`} />
                <span>{synth.name}</span>
                {balances && balances[synth.name] ? (
                  <span className={styles.synthTableBalance}>
                    {synth.sign}
                    {numbro(Number(balances[synth.name])).format('0,0.00')}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  render() {
    const { position } = this.props;
    return (
      <div style={position} className={styles.synthPickerBox}>
        <div className={styles.synthTable}>{this.renderSynths()}</div>
      </div>
    );
  }
}

export default SynthPickerBox;
