import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAvailableSynths } from '../../ducks';

const Trade = ({ synths }) => {
	console.log(synths);
	return <div>trade page bitch</div>;
};

const mapStateToProps = state => {
	return {
		synths: getAvailableSynths(state),
	};
};

Trade.propTypes = {
	synths: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(Trade);
