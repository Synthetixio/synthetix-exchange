import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { FlexDiv } from 'shared/commonStyles';
import { DataSmall } from 'components/Typography/Data';

type OrderInfoRowProps = {
	label: ReactNode;
	value: ReactNode;
};

type OrderInfoBlockProps = {
	orderData: OrderInfoRowProps[];
};

const OrderInfoRow: FC<OrderInfoRowProps> = ({ label, value }) => {
	return (
		<Row>
			<StyledLabel>{label}</StyledLabel>
			<StyledValue>{value}</StyledValue>
		</Row>
	);
};

const OrderInfoBlock: FC<OrderInfoBlockProps> = ({ orderData }) => {
	if (!orderData || !orderData.length) return null;
	return (
		<Wrapper>
			{orderData.map(({ label, value }, idx: number) => (
				<OrderInfoRow key={idx} label={label} value={value} />
			))}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 28px;
`;

const Row = styled(FlexDiv)`
	justify-content: space-between;
	padding-bottom: 8px;
	margin: 16px 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
`;

const StyledLabel = styled(DataSmall)`
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: capitalize;
`;

const StyledValue = styled(DataSmall)`
	text-transform: none;
`;

export default OrderInfoBlock;
