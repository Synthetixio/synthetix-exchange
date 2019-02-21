import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleFeedbackPopup } from '../../ducks/ui';

import Popup from '../popup';
import styles from './feedback-popup.module.scss';

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

class FeedbackPopup extends Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      newFeaturesRequest: '',
      featuresNotInterestedIn: '',
      comments: '',
      ratingHover: 0,
    };
    this.closePopup = this.closePopup.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  closePopup() {
    const { toggleFeedbackPopup } = this.props;
    toggleFeedbackPopup(false);
  }

  async submitForm(e) {
    e.preventDefault();
    const {
      rating,
      newFeaturesRequest,
      featuresNotInterestedIn,
      comments,
    } = this.state;
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'feedback',
          rating,
          newFeaturesRequest,
          featuresNotInterestedIn,
          comments,
        }),
      });
      this.setState({ showThanks: true });
      setTimeout(() => {
        this.closePopup();
        this.setState({ showThanks: false });
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }

  renderRatings() {
    const { rating, ratingHover } = this.state;
    return (
      <div
        className={styles.ratingStarRow}
        onMouseLeave={() => this.setState({ ratingHover: 0 })}
      >
        {[1, 2, 3, 4, 5].map(index => {
          return (
            <div
              onClick={() => this.setState({ rating: index })}
              onMouseEnter={() => this.setState({ ratingHover: index })}
              className={`${styles.ratingStar} ${
                index <= rating || index <= ratingHover
                  ? styles.ratingStarFull
                  : ''
              }`}
              key={index}
            />
          );
        })}
      </div>
    );
  }

  renderForm() {
    return (
      <form
        className={styles.feedbackForm}
        name="feedback"
        onSubmit={this.submitForm}
      >
        <div className={styles.formSection}>
          <h2>How would you rate your experience using Synthetix.Exchange?</h2>
          {this.renderRatings()}
        </div>
        <div className={styles.formSection}>
          <h2>Which features would you like to see added?</h2>
          <textarea className={styles.formTextArea} />
        </div>
        <div className={styles.formSection}>
          <h2>Which current features are you not interested in using?</h2>
          <textarea className={styles.formTextArea} />
        </div>
        <div className={styles.formSection}>
          <h2>Any further comments or questions?</h2>
          <textarea className={styles.formTextArea} />
        </div>
        <button className={styles.formButton} type="submit">
          Submit
        </button>
      </form>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { showThanks } = this.state;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.feedbackPopup}>
          <h1>
            {showThanks
              ? 'Thanks for your feedback!'
              : 'Please give us your feedback'}
          </h1>
          {!showThanks ? this.renderForm() : null}
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
