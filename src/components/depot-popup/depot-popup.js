import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';

import { toggleDepotPopup } from '../../ducks/ui';
import { getCurrentWalletInfo } from '../../ducks';

import styles from './depot-popup.module.scss';

class DepotPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    const { toggleDepotPopup } = this.props;
    toggleDepotPopup(false);
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.depotPopup}>
          <h1>This is DEPOT POPUP</h1>
          <h2>blablabla</h2>
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
  toggleDepotPopup,
};

DepotPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  toggleTestnetPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepotPopup);
