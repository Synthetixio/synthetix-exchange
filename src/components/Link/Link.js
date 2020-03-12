import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink, ExternalLink } from 'src/shared/commonStyles';

export const Link = ({ to, isExternal, ...rest }) =>
	isExternal ? <ExternalLink href={to} {...rest} /> : <RouterLink to={to} {...rest} />;

Link.propTypes = {
	to: PropTypes.string.isRequired,
	isExternal: PropTypes.bool,
};

export default Link;
