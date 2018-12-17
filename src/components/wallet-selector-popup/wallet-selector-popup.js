import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

import Popup from '../popup';

import { toggleWalletSelectorPopup, changeScreen } from '../../ducks/ui';
import { connectToWallet, setSelectedWallet } from '../../ducks/wallet';
import { getCurrentWalletInfo } from '../../ducks/';

import { getExtensionUri } from '../../utils/browserUtils';
import { getEthereumNetwork } from '../../utils/metamaskTools';

import SynthetixJsTools from '../../synthetixJsTool';

import styles from './wallet-selector-popup.module.scss';

const WALLET_TYPES = ['Metamask', 'Trezor', 'Ledger'];
const WALLET_DESCRIPTIONS = {
  Metamask:
    'MetaMask is a browser extension that allows you to connect directly to decentralised applications.',
  Trezor:
    'Connect to Synthetix and use tokens that are stored on a Trezor Hardware Wallet.',
  Ledger:
    'Connect to Synthetix and use tokens that are stored on a Ledger Hardware Wallet.',
};

class WalletSelectorPopup extends Component {
  constructor() {
    super();
    this.state = {
      extensionUri: '',
      metamaskInstalled: false,
    };
    this.closePopup = this.closePopup.bind(this);
    this.goToWalletConnector = this.goToWalletConnector.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  componentDidMount() {
    if (window.web3) {
      this.setState({ metamaskInstalled: true });
    }
    this.setState({ extensionUri: getExtensionUri() });
  }

  closePopup() {
    const { toggleWalletSelectorPopup } = this.props;
    toggleWalletSelectorPopup(false);
  }

  registerMetamaskAddressListener = () => {
    const listener = throttle(this.onMetamaskAddressChange, 2000);
    if (
      SynthetixJsTools.signer &&
      SynthetixJsTools.signer.provider &&
      SynthetixJsTools.signer.provider._web3Provider
    ) {
      SynthetixJsTools.signer.provider._web3Provider.publicConfigStore.on(
        'update',
        listener
      );
    }
  };

  onMetamaskAddressChange = data => {
    const { currentWalletInfo, setSelectedWallet } = this.props;

    if (
      currentWalletInfo.selectedWallet.toLocaleLowerCase() ===
      data.selectedAddress.toLowerCase()
    ) {
      return;
    }
    const newSelectedAddress = data.selectedAddress;

    setSelectedWallet({
      availableWallets: [newSelectedAddress],
      selectedWallet: newSelectedAddress,
    });
  };

  goToWalletConnector(walletType) {
    return async () => {
      const { changeScreen, connectToWallet } = this.props;
      const { extensionUri } = this.state;

      // We define a new signer
      const signer = new SynthetixJsTools.signers[walletType]();
      SynthetixJsTools.setContractSettings({
        signer,
      });

      try {
        switch (walletType) {
          // If signer is Metamask
          case 'Metamask':
            if (!window.web3 && extensionUri) {
              window.open(extensionUri);
            } else {
              const { name, networkId } = await getEthereumNetwork();
              // If Metamask is not set on supported network, we send an unlocked reason
              if (!name) {
                connectToWallet({
                  walletType,
                  unlocked: false,
                  unlockReason: 'MetamaskNotMainNet',
                });
                //Otherwise we get the current wallet address
              } else {
                if (window.ethereum) {
                  await window.ethereum.enable();
                }

                SynthetixJsTools.setContractSettings({
                  signer,
                  networkId,
                  provider: SynthetixJsTools.havvenJs.ethers.providers.getDefaultProvider(
                    name && name.toLowerCase()
                  ),
                });
                const accounts = await SynthetixJsTools.signer.getNextAddresses();

                // If we do have a wallet address, we save it
                if (accounts.length > 0) {
                  connectToWallet({
                    walletType,
                    availableWallets: accounts,
                    selectedWallet: accounts[0],
                    unlocked: true,
                    networkId,
                  });
                  this.closePopup();
                  this.registerMetamaskAddressListener();
                } else {
                  // Otherwise we send an unlocked reason
                  connectToWallet({
                    walletType,
                    unlocked: false,
                    unlockReason: 'MetamaskNoAccounts',
                  });
                }
              }
            }
            break;

          // If signer is Trezor
          case 'Trezor':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            });
            changeScreen('connectToWallet');
            break;

          // If signer is Ledger
          case 'Ledger':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            });
            changeScreen('connectToWallet');
            break;
          default:
            connectToWallet({
              unlocked: false,
            });
        }
      } catch (e) {}
    };
  }

  renderButton(walletType) {
    return (
      <button
        onClick={this.goToWalletConnector(walletType)}
        key={walletType}
        className={styles.button}
      >
        <div className={styles.buttonInner}>
          <img
            height={51}
            src={`images/wallets/${walletType.toLowerCase()}-medium.svg`}
            alt={`${walletType} icon`}
          />
          <div className={styles.walletDescription}>
            <div className={styles.walletDescriptionHeading}>{walletType}</div>
            <div className={styles.walletDescriptionText}>
              {WALLET_DESCRIPTIONS[walletType]}
            </div>
          </div>
        </div>
      </button>
    );
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div>
          <h1>Connect a Wallet</h1>
          <div className={styles.buttonsWrapper}>
            {WALLET_TYPES.map(this.renderButton)}
          </div>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {
  toggleWalletSelectorPopup,
  changeScreen,
  connectToWallet,
  setSelectedWallet,
};

WalletSelectorPopup.propTypes = {
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  connectToWallet: PropTypes.func.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSelectorPopup);
