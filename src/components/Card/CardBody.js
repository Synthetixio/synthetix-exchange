import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CardBody = memo(({ children, ...rest }) => <Container {...rest}>{children}</Container>);

CardBody.propTypes = {
	children: PropTypes.node.isRequired,
};

const Container = styled.div`
	padding: 16px 12px 18px 12px;
`;

export default CardBody;
