import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToBuy,
} from '../../ducks/';
import { changeScreen } from '../../ducks/ui';

import styles from './synth-transaction.module.scss';

class SynthTransaction extends Component {
  render() {
    const { synthToBuy } = this.props;
    return <div>this is the syn tx screen with {synthToBuy}</div>;
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToBuy: getSynthToBuy(state),
  };
};

const mapDispatchToProps = {
  changeScreen,
};

SynthTransaction.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToBuy: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynthTransaction);
