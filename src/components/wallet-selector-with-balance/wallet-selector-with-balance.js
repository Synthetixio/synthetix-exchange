import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import OutsideClickHandler from 'react-outside-click-handler';
import SynthPickerBox from '../synth-picker/synth-picker-box';
import Spinner from '../spinner';
import styles from './wallet-selector-balance.module.scss';

class WalletSelectorWithBalances extends Component {
  constructor() {
    super();
    this.state = {
      synthPickerBoxIsOpen: false,
      selectedSynth: 'sUSD',
    };
    this.onSynthSelect = this.onSynthSelect.bind(this);
  }

  renderTableContent() {
    const {
      availableWallets,
      walletPageSize,
      walletSelectorIndex,
      onSelectWallet,
    } = this.props;
    const { selectedSynth } = this.state;
    return availableWallets
      .slice(walletSelectorIndex, walletSelectorIndex + walletPageSize)
      .map((wallet, index) => {
        const {
          collateral = 0,
          synthetixEscrow = 0,
          rewardEscrow = 0,
          eth = 0,
        } = wallet.balances;
        const totalEscrow = synthetixEscrow + rewardEscrow;
        return (
          <tr key={index} onClick={onSelectWallet(index)}>
            <td>{wallet.address}</td>
            <td>{collateral ? numbro(collateral).format('0,0.00') : 0}</td>
            <td>{totalEscrow ? numbro(totalEscrow).format('0,0.00') : 0}</td>
            <td>
              {wallet.balances && wallet.balances[selectedSynth]
                ? numbro(wallet.balances[selectedSynth]).format('0,0.00')
                : 0}
            </td>
            <td>{eth ? numbro(eth).format('0,0.00') : 0}</td>
          </tr>
        );
      });
  }

  renderPager() {
    const { onNextPage, onPrevPage, showSpinner, walletType } = this.props;
    if (walletType === 'Metamask') return;
    return (
      <div className={styles.pagerRow}>
        <svg
          className={styles.pagerRowIcon}
          width="40"
          height="40"
          viewBox="0 0 1792 1792"
          onClick={onPrevPage}
        >
          <path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" />
        </svg>

        {showSpinner && (
          <div className="spinner">
            <Spinner small={true} />
          </div>
        )}
        <svg
          className={styles.pagerRowIcon}
          width="40"
          height="40"
          viewBox="0 0 1792 1792"
          onClick={onNextPage}
        >
          <path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" />
        </svg>
      </div>
    );
  }

  onSynthSelect(synth) {
    const { onSynthBalanceRequest } = this.props;
    return () => {
      this.setState({ selectedSynth: synth.name, synthPickerBoxIsOpen: false });
      onSynthBalanceRequest(synth.name);
    };
  }

  renderSynthBalanceHeader() {
    const { availableSynths } = this.props;
    const { synthPickerBoxIsOpen, selectedSynth } = this.state;
    return (
      <th className={styles.synthTableHeader}>
        <OutsideClickHandler
          onOutsideClick={() => this.setState({ synthPickerBoxIsOpen: false })}
        >
          <span onClick={() => this.setState({ synthPickerBoxIsOpen: true })}>
            {selectedSynth} Balance
          </span>
          {synthPickerBoxIsOpen ? (
            <SynthPickerBox
              synths={availableSynths}
              position={{ top: 'calc(100% + 10px)', right: 0 }}
              onSynthSelect={this.onSynthSelect}
              filterNotNeeded={true}
              onSynthSelect={this.onSynthSelect}
            />
          ) : null}
        </OutsideClickHandler>
      </th>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.walletSelectorHeader}>
          <h1>Select Wallet</h1>
          <h2>Please select the wallet you would like to use</h2>
        </div>
        <table cellSpacing="0" cellPadding="0" className={styles.balanceTable}>
          <thead>
            <tr>
              <th>Address</th>
              <th>Total SNX Balance</th>
              <th>Escrowed SNX</th>
              {this.renderSynthBalanceHeader()}
              <th>ETH Balance</th>
            </tr>
          </thead>
          <tbody>{this.renderTableContent()}</tbody>
        </table>
        {this.renderPager()}
      </div>
    );
  }
}

WalletSelectorWithBalances.propTypes = {
  availableWallets: PropTypes.array.isRequired,
  walletPageSize: PropTypes.number.isRequired,
  walletSelectorIndex: PropTypes.number.isRequired,
  availableSynths: PropTypes.array,
  onSelectWallet: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool.isRequired,
  walletType: PropTypes.string.isRequired,
  onSynthBalanceRequest: PropTypes.func.isRequired,
};

export default WalletSelectorWithBalances;
