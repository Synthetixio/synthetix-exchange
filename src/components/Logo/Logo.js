import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getCurrentTheme } from '../../ducks';

const Logo = ({ theme }) => {
	const logoColor = theme === 'light' ? 'dark' : 'light';
	return <LogoImg src={`/images/synthetix-logo-${logoColor}.svg`} />;
};

const LogoImg = styled.img``;

Logo.propTypes = {
	synths: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
	return {
		theme: getCurrentTheme(state),
	};
};

export default connect(mapStateToProps, null)(Logo);
