import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

import Popup from '../popup'

import { toggleWalletSelectorPopup, changeScreen } from '../../ducks/ui'
import { connectToWallet, setSelectedWallet } from '../../ducks/wallet'
import { getCurrentWalletInfo } from '../../ducks/'

import { getExtensionUri } from '../../utils/browserUtils'
import { getEthereumNetwork } from '../../utils/metamaskTools'
import {
  INFURA_JSON_RPC_URLS,
  INFURA_PROJECT_ID,
} from '../../utils/networkUtils'
import synthetixJsTools from '../../synthetixJsTool'

import styles from './wallet-selector-popup.module.scss'

const WALLET_TYPES = ['Metamask', 'WalletConnect', 'Trezor', 'Ledger']

class WalletSelectorPopup extends Component {
  constructor() {
    super()
    this.state = {
      extensionUri: '',
      metamaskInstalled: false,
    }
    this.closePopup = this.closePopup.bind(this)
    this.goToWalletConnector = this.goToWalletConnector.bind(this)
    this.renderButton = this.renderButton.bind(this)
  }

  componentDidMount() {
    if (window.web3) {
      this.setState({ metamaskInstalled: true })
    }
    this.setState({ extensionUri: getExtensionUri() })
  }

  closePopup() {
    const { toggleWalletSelectorPopup } = this.props
    toggleWalletSelectorPopup(false)
  }

  registerMetamaskAddressListener = () => {
    const listener = throttle(this.onMetamaskAddressChange, 2000)
    if (
      synthetixJsTools.signer &&
      synthetixJsTools.signer.provider &&
      synthetixJsTools.signer.provider._web3Provider
    ) {
      synthetixJsTools.signer.provider._web3Provider.publicConfigStore.on(
        'update',
        listener
      )
    }
  }

  onMetamaskAddressChange = async data => {
    const { currentWalletInfo, setSelectedWallet } = this.props
    if (
      currentWalletInfo.selectedWallet.toLocaleLowerCase() ===
      data.selectedAddress.toLowerCase()
    ) {
      return
    }
    const newSelectedAddress = await synthetixJsTools.signer.getNextAddresses()
    setSelectedWallet({
      availableWallets: newSelectedAddress,
      selectedWallet: newSelectedAddress[0],
    })
  }

  goToWalletConnector(walletType) {
    return async () => {
      const { changeScreen, connectToWallet } = this.props
      const { extensionUri } = this.state
      // We define a new signer
      try {
        const { name, networkId } = await getEthereumNetwork()
        const signerConfig =
          walletType === 'Coinbase'
            ? {
                appName: 'Synthetix.Exchange',
                appLogoUrl: `${window.location.origin}/images/synthetix-logo-small.png`,
                jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
                networkId,
              }
            : walletType === 'WalletConnect'
            ? { infuraId: INFURA_PROJECT_ID }
            : {}
        const signer = new synthetixJsTools.signers[walletType](signerConfig)
        synthetixJsTools.setContractSettings({
          networkId,
          signer,
        })
        switch (walletType) {
          // If signer is Metamask
          case 'Metamask':
            if (!window.web3 && extensionUri) {
              window.open(extensionUri)
            } else {
              // If Metamask is not set on supported network, we send an unlocked reason
              if (!name) {
                connectToWallet({
                  walletType,
                  unlocked: false,
                  unlockReason: 'MetamaskNotMainNet',
                })
                //Otherwise we get the current wallet address
              } else {
                if (window.ethereum) {
                  await window.ethereum.enable()
                }
                synthetixJsTools.setContractSettings({
                  signer,
                  networkId,
                  provider: synthetixJsTools.synthetixJs.ethers.getDefaultProvider(
                    name && name.toLowerCase()
                  ),
                })
                const accounts = await synthetixJsTools.signer.getNextAddresses()

                // If we do have a wallet address, we save it
                if (accounts.length > 0) {
                  connectToWallet({
                    walletType,
                    availableWallets: accounts,
                    selectedWallet: accounts[0],
                    unlocked: true,
                    networkId,
                  })
                  this.closePopup()
                  this.registerMetamaskAddressListener()
                } else {
                  // Otherwise we send an unlocked reason
                  connectToWallet({
                    walletType,
                    unlocked: false,
                    unlockReason: 'MetamaskNoAccounts',
                  })
                }
              }
            }
            break

          case 'Coinbase': {
            const accounts = await synthetixJsTools.signer.getNextAddresses()
            // If we do have a wallet address, we save it
            if (accounts && accounts.length > 0) {
              connectToWallet({
                walletType,
                availableWallets: accounts,
                selectedWallet: accounts[0],
                unlocked: true,
                networkId,
              })
              this.closePopup()
            } else {
              // Otherwise we send an unlocked reason
              connectToWallet({
                walletType,
                unlocked: false,
                unlockReason: 'CoinbaseNoAccounts',
              })
            }
            break
          }

          // If signer is Trezor
          case 'Trezor':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            })
            changeScreen('connectToWallet')
            break

          // If signer is Ledger
          case 'Ledger':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            })
            changeScreen('connectToWallet')
            break

          case 'WalletConnect': {
            try {
              await signer.provider._web3Provider.enable()
              synthetixJsTools.setContractSettings({
                signer,
                networkId,
                provider: synthetixJsTools.synthetixJs.ethers.getDefaultProvider(
                  name && name.toLowerCase()
                ),
              })
              const accounts = await synthetixJsTools.signer.getNextAddresses()
              connectToWallet({
                walletType,
                availableWallets: accounts,
                selectedWallet: accounts[0],
                unlocked: true,
                networkId,
              })
              this.closePopup()
            } catch (err) {
              connectToWallet({
                walletType,
                unlocked: false,
                unlockReason: 'WalletConnectError',
              })
            }
            break
          }
          default:
            connectToWallet({
              unlocked: false,
            })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  renderButton(walletType) {
    const { metamaskInstalled } = this.state
    return (
      <button
        onClick={this.goToWalletConnector(walletType)}
        key={walletType}
        className={styles.button}
        disabled={walletType === 'Metamask' && !metamaskInstalled}
      >
        <div className={styles.buttonInner}>
          <img
            height={51}
            src={`images/wallets/${walletType.toLowerCase()}-medium.svg`}
            alt={`${walletType} icon`}
          />
          <div className={styles.walletDescription}>
            <div className={styles.walletDescriptionHeading}>
              {walletType === 'Metamask' && !metamaskInstalled
                ? 'Metamask (not installed)'
                : walletType === 'Coinbase'
                ? 'Coinbase Wallet'
                : walletType}
            </div>
          </div>
        </div>
      </button>
    )
  }

  render() {
    const { isVisible } = this.props
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div>
          <h1>Connect a Wallet</h1>
          <div className={styles.buttonsWrapper}>
            {WALLET_TYPES.map(this.renderButton)}
          </div>
        </div>
      </Popup>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  }
}

const mapDispatchToProps = {
  toggleWalletSelectorPopup,
  changeScreen,
  connectToWallet,
  setSelectedWallet,
}

WalletSelectorPopup.propTypes = {
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  connectToWallet: PropTypes.func.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectorPopup)
