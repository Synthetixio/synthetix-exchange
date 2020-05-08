import React from 'react';
import styled from 'styled-components';

import { LabelSmall } from 'src/components/Typography';

const Chart = () => {
	return (
		<ChartContainer>
			<HeaderRow>
				<StyledLabel>Shorts</StyledLabel>
				<StyledLabel>Longs</StyledLabel>
			</HeaderRow>
		</ChartContainer>
	);
};

const ChartContainer = styled.div`
	width: 100%;
	position: relative;
`;

const HeaderRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const StyledLabel = styled(LabelSmall)`
	text-transform: uppercase;
	flex: 1;
`;

export default Chart;
