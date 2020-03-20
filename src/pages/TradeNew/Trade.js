import React, { useEffect } from 'react';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from 'src/shared/commonStyles';

import ChartCard from './components/ChartCard';
import CreateOrderCard from './components/CreateOrderCard';
import OrderBookCard from './components/OrderBookCard';

const Trade = () => {
	return (
		<CenteredPageLayout>
			<TradeContainer>
				<RowContainer>
					<ChartContainer>
						<ChartCard></ChartCard>
					</ChartContainer>
					<CreateOrderContainer>
						<CreateOrderCard />
					</CreateOrderContainer>
				</RowContainer>
				<SectionVerticalSpacer />
				<RowContainer>
					<OrderBookContainer>
						<OrderBookCard />
					</OrderBookContainer>
				</RowContainer>
			</TradeContainer>
		</CenteredPageLayout>
	);
};

const RowContainer = styled.div`
	display: flex;
	width: 100%;
`;
const TradeContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;
const ChartContainer = styled.div`
	flex: 1;
`;
const CreateOrderContainer = styled.div`
	width: 282px;
	margin-left: 8px;
`;
const OrderBookContainer = styled.div`
	width: 100%;
`;

export default Trade;
