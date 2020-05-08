import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import { LabelSmall } from 'src/components/Typography';
import { formatPercentage } from 'src/utils/formatters';

const Chart = ({ data }) => (
	<ChartContainer>
		<VerticalBar />
		<HeaderRow>
			<StyledLabel>Shorts</StyledLabel>
			<StyledLabel>Longs</StyledLabel>
		</HeaderRow>
		{data
			? Object.keys(data).map(key => {
					const synthName = `s${key}`;
					const inverseName = `i${key}`;

					const synthValue = data[key][synthName];
					const inverseValue = data[key][inverseName];

					const totalValue = synthValue + inverseValue;

					return (
						<SynthContainer key={`synth-${key}`}>
							<ShortSynth>
								<SynthLabel>{inverseName}</SynthLabel>
								<LabelSmall>{formatPercentage(inverseValue / totalValue, 0)}</LabelSmall>
							</ShortSynth>
							<LongSynth>
								<SynthLabel>{synthName}</SynthLabel>
								<LabelSmall>{formatPercentage(synthValue / totalValue, 0)}</LabelSmall>
							</LongSynth>
							<BarContainer>
								<ShortBar value={inverseValue / totalValue}></ShortBar>
								<LongBar value={synthValue / totalValue}></LongBar>
							</BarContainer>
						</SynthContainer>
					);
			  })
			: null}
	</ChartContainer>
);

const ChartContainer = styled.div`
	width: 100%;
	min-height: 250px;
	position: relative;
`;

const VerticalBar = styled.div`
	position: absolute;
	border-left: 1px solid #cb5bf2;
	top: 25px;
	bottom: 0;
	left: 50%;
`;

const HeaderRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 13px 0;
`;

const SynthContainer = styled.div`
	height: 58px;
	justify-content: center;
	display: flex;
	padding: 0 38px;
	align-items: center;
	width: 100%;
	border-top: 1px solid #cb5bf2;
	&:last-child {
		border-bottom: 1px solid #cb5bf2;
	}
`;

const BarContainer = styled.div`
	position: relative;
	height: 26px;
	width: 100%;
`;

const slideToLeft = value => keyframes`
  from {
    left: 50%;
  }
  to {
   left: ${value};
  }
`;

const slideToRight = value => keyframes`
  from {
    right: 50%;
  }
  to {
   right: ${value};
  }
`;

const barStyle = css`
	position: absolute;
	height: 26px;
	transition: all 0.5s linear;
	bottom: 26px;
	top: 0;
`;

const SynthLabel = styled(LabelSmall)`
	color: ${props => props.theme.colors.fontSecondary};
`;

const ShortSynth = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	left: 0;
	width: 32px;
	text-align: left;
`;

const LongSynth = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	right: 0;
	width: 38px;
	text-align: right;
`;

const ShortBar = styled.div`
	${barStyle}
	background-image: linear-gradient(#EA5281, #F6635C);
	right: 50%;
	animation: ${props => slideToLeft(`calc((50%  - 50%  * ${props.value}))`)} 0.5s forwards linear;
`;

const LongBar = styled.div`
	${barStyle}
	background-image: linear-gradient(#00E2DF, #BFF360);
	left: 50%;
	animation: ${props => slideToRight(`calc((50%  - 50%  * ${props.value}))`)} 0.5s forwards linear;
`;

const StyledLabel = styled(LabelSmall)`
	text-transform: uppercase;
	flex: 1;
`;

export default Chart;
