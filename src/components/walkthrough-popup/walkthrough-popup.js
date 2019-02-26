import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleWalkthroughPopup } from '../../ducks/ui';

import Popup from '../popup';
import styles from './walkthrough-popup.module.scss';

class FeedbackPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    const { toggleWalkthroughPopup } = this.props;
    toggleWalkthroughPopup(false);
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.walkthroughPopup}>
          <iframe
            ref="iframe"
            width="640"
            height="360"
            src="https://www.youtube.com/embed/REGvIiHSqZA"
            frameBorder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen="allowFullScreen"
          />
        </div>
      </Popup>
    );
  }
}

const mapDispatchToProps = {
  toggleWalkthroughPopup,
};

FeedbackPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleWalkthroughPopup: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(FeedbackPopup);
