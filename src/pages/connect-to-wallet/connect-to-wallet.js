import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../../components/spinner';
import WalletSelectorWithBalance from '../../components/wallet-selector-with-balance';

import { getCurrentWalletInfo } from '../../ducks/';
import { connectToWallet } from '../../ducks/wallet';
import { changeScreen } from '../../ducks/ui';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './connect-to-wallet.module.scss';

const WALLET_PAGE_SIZE = 5;

class ConnectToWallet extends Component {
  constructor() {
    super();
    this.state = {
      connected: false,
      availableWallets: [],
      walletSelectorIndex: 0,
      fetchingNextAddresses: false,
    };
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onSelectWallet = this.onSelectWallet.bind(this);
  }
  async componentDidMount() {
    const { currentWalletInfo } = this.props;
    let availableWallets = await synthetixJsTools.signer.getNextAddresses(0);
    if (!availableWallets || !availableWallets.length) {
      return;
    }
    this.setState({ connected: true });
    availableWallets = availableWallets.map(address => ({
      address,
      balances: [],
    }));
    this.setState({
      availableWallets,
    });
    const balances = await this.getWalletsBalances(availableWallets);
    availableWallets.forEach((wallet, index) => {
      wallet.balances = balances[index];
    });
    if (!availableWallets || !availableWallets.length) {
      return connectToWallet({
        walletType: currentWalletInfo.walletType,
        unlocked: false,
        unlockReason: currentWalletInfo.walletType + 'Locked',
      });
    }
    this.setState({
      availableWallets,
    });
  }

  async getWalletsBalances(wallets) {
    const balancePromises = wallets.map(wallet =>
      Promise.all([
        synthetixJsTools.havvenJs.Synthetix.balanceOf(wallet.address),
        synthetixJsTools.havvenJs.SynthetixEscrow.balanceOf(wallet.address),
        synthetixJsTools.havvenJs.sUSD.balanceOf(wallet.address),
        synthetixJsTools.provider.getBalance(wallet.address),
      ])
    );
    let balances = await Promise.all(balancePromises);
    return balances.map(wallet =>
      wallet.map(balance => formatBigNumber(balance, 6))
    );
  }

  async getNextAddresses(pageSize) {
    const { availableWallets } = this.state;
    if (!synthetixJsTools.signer.getNextAddresses) return;
    let nextAddresses = await synthetixJsTools.signer.getNextAddresses(
      availableWallets.length,
      pageSize
    );
    nextAddresses = nextAddresses.map(address => ({ address, balances: [] }));
    availableWallets.push(...nextAddresses);
    this.setState({
      availableWallets,
    });
    const balancePromises = nextAddresses.map(wallet =>
      Promise.all([
        synthetixJsTools.havvenJs.Synthetix.balanceOf(wallet.address),
        synthetixJsTools.havvenJs.SynthetixEscrow.balanceOf(wallet.address),
        synthetixJsTools.havvenJs.sUSD.balanceOf(wallet.address),
        synthetixJsTools.provider.getBalance(wallet.address),
      ])
    );
    let balances = await Promise.all(balancePromises);
    balances = balances.map(wallet =>
      wallet.map(balance => formatBigNumber(balance, 6))
    );
    nextAddresses.forEach((wallet, index) => {
      wallet.balances = balances[index];
    });
    this.setState({ availableWallets });
  }

  selectWalletIndex(walletIndex) {
    const walletAddress = this.state.availableWallets[walletIndex];
    if (!walletAddress) return;
    synthetixJsTools.signer.setAddressIndex(walletIndex);
  }

  onSelectWallet(index) {
    return async () => {
      const { walletSelectorIndex, availableWallets } = this.state;
      const { currentWalletInfo, connectToWallet, changeScreen } = this.props;
      const { walletType } = currentWalletInfo;
      const idx = walletSelectorIndex + index;
      const availableWalletsStringArray = availableWallets.map(
        wallet => wallet.address
      );
      const selectedWallet = availableWalletsStringArray[idx];
      await connectToWallet({
        walletType,
        walletSelectorIndex: idx,
        unlocked: true,
        walletSelected: true,
        availableWallets: availableWalletsStringArray,
        selectedWallet,
      });
      await this.selectWalletIndex(idx);
      changeScreen('exchange');
    };
  }

  async onNextPage() {
    const { walletSelectorIndex, availableWallets } = this.state;
    if (walletSelectorIndex + WALLET_PAGE_SIZE >= availableWallets.length) {
      await this.setState({ fetchingNextAddresses: true });
      await this.getNextAddresses(WALLET_PAGE_SIZE);
      this.setState({ fetchingNextAddresses: false });
    }
    this.setState({
      walletSelectorIndex: walletSelectorIndex + WALLET_PAGE_SIZE,
    });
  }

  async onPrevPage() {
    const { walletSelectorIndex } = this.state;
    let index = walletSelectorIndex - WALLET_PAGE_SIZE;
    if (index < 0) index = 0;
    this.setState({ walletSelectorIndex: index });
  }

  renderConnectingScreen() {
    const { currentWalletInfo } = this.props;
    return (
      <div className={styles.connectToWallet}>
        <h1>Convert via {currentWalletInfo.walletType}</h1>
        <Spinner />
      </div>
    );
  }

  render() {
    const {
      walletSelectorIndex,
      fetchingNextAddresses,
      availableWallets,
      connected,
    } = this.state;
    return (
      <div className={styles.connectToWallet}>
        {connected ? (
          <WalletSelectorWithBalance
            availableWallets={availableWallets}
            walletPageSize={WALLET_PAGE_SIZE}
            walletSelectorIndex={walletSelectorIndex}
            showSpinner={fetchingNextAddresses}
            onSelectWallet={this.onSelectWallet}
            onNextPage={this.onNextPage}
            onPrevPage={this.onPrevPage}
          />
        ) : (
          this.renderConnectingScreen()
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {
  connectToWallet,
  changeScreen,
};

ConnectToWallet.propTypes = {
  connectToWallet: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectToWallet);
