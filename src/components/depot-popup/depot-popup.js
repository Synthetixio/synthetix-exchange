import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';
import GweiSelector from '../gwei-selector';

import { toggleDepotPopup } from '../../ducks/ui';
import { getCurrentWalletInfo, getEthRate } from '../../ducks';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './depot-popup.module.scss';

class DepotPopup extends Component {
  constructor() {
    super();
    this.state = {
      ethInputValue: 0,
      synthInputValue: '',
      ethBalance: null,
    };
    this.closePopup = this.closePopup.bind(this);
    this.onBuyMaxClick = this.onBuyMaxClick.bind(this);
    this.onEthInputChange = this.onEthInputChange.bind(this);
    this.onSynthInputChange = this.onSynthInputChange.bind(this);
  }

  closePopup() {
    const { toggleDepotPopup } = this.props;
    toggleDepotPopup(false);
  }

  buyFromDepot() {
    console.log('buy');
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      const { currentWalletInfo } = this.props;
      const { initialized, provider } = synthetixJsTools;
      if (
        !initialized ||
        !currentWalletInfo ||
        !currentWalletInfo.selectedWallet
      )
        return;
      const { selectedWallet } = currentWalletInfo;
      const ethBalance = await provider.getBalance(selectedWallet);
      this.setState({ ethBalance: formatBigNumber(ethBalance, 6) });
    }
  }

  onEthInputChange(e) {
    const { ethRate } = this.props;
    const { ethInputValue } = this.state;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : ethInputValue;
    const synthInputValue = newInputValue * ethRate;
    this.setState({
      ethInputValue: newInputValue,
      synthInputValue,
    });
  }

  onSynthInputChange(e) {
    const { ethRate } = this.props;
    const { synthInputValue } = this.state;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : synthInputValue;
    const ethInputValue = newInputValue / ethRate;
    this.setState({
      ethInputValue,
      synthInputValue: newInputValue,
    });
  }

  onBuyMaxClick() {
    const { ethBalance } = this.state;
    this.setState({ ethInputValue: ethBalance }, this.onEthInputChange);
  }

  renderEthBalance() {
    const { ethBalance } = this.state;
    return (
      <div className={styles.ethBalance}>
        <span>ETH Balance</span>
        <span>{ethBalance ? ethBalance : '0.00'}</span>
      </div>
    );
  }
  render() {
    const { isVisible } = this.props;
    const { ethInputValue, synthInputValue } = this.state;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.depotPopup}>
          <h1>Buy sUSD with ETH</h1>
          <p className={styles.popupDescription}>
            Here you can purchase sUSD through our Depot, which is a platform
            available through Mintr and Swappr that allows sUSD buyers to buy
            from SNX holders who have minted sUSD.{' '}
          </p>
          {this.renderEthBalance()}
          <div className={styles.inputLabelRow}>
            <span>Amount</span>
            <button
              className={styles.buyMaxButton}
              onClick={this.onBuyMaxClick}
            >
              Buy Max
            </button>
          </div>
          <div className={styles.inputRow}>
            <input
              value={ethInputValue || ''}
              placeholder={0}
              onChange={this.onEthInputChange}
              pattern="^-?[0-9]\d*\.?\d*$"
              className={styles.inputElement}
              type="text"
            />
            <img src="/images/swap-icon.svg" />
            <input
              value={synthInputValue || ''}
              placeholder={0}
              onChange={this.onSynthInputChange}
              pattern="^-?[0-9]\d*\.?\d*$"
              className={styles.inputElement}
              type="text"
            />
          </div>
          <GweiSelector />
          <button
            className={styles.buyButton}
            type="button"
            onClick={this.buyFromDepot}
          >
            Buy
          </button>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    ethRate: getEthRate(state),
  };
};
const mapDispatchToProps = {
  toggleDepotPopup,
};

DepotPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  toggleDepotPopup: PropTypes.func.isRequired,
  ethRate: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepotPopup);
