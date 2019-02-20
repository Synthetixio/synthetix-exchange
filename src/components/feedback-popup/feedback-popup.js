import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleFeedbackPopup } from '../../ducks/ui';

import Popup from '../popup';
import styles from './feedback-popup.module.scss';

class FeedbackPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }
  closePopup() {
    const { toggleFeedbackPopup } = this.props;
    toggleFeedbackPopup(false);
  }
  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.feedbackPopup}>
          <h1>Please give us your feedback</h1>
          <form name="feedback" />
        </div>
      </Popup>
    );
  }
}

const mapDispatchToProps = {
  toggleFeedbackPopup,
};

FeedbackPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleFeedbackPopup: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(FeedbackPopup);
