import React, { useState, useEffect } from 'react';
import styled, { keyframes, withTheme, createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';

import { gweiPopupIsVisible } from '../../ducks';
import { toggleGweiPopup } from '../../ducks/ui';
import { formatCurrency } from '../../utils/formatters';
import { getTransactionPrice } from '../../utils/networkUtils';

import { HeadingMedium, BodyMedium, DataSmall } from '../Typography';
import Slider from '../Slider';

import { getGasInfo, getEthRate } from '../../ducks/';
import { setGasPrice } from '../../ducks/transaction';

import { Table, Tr, Th, Td, Thead, Tbody, DataLabel } from '../Table';
import { ButtonPrimary } from '../Button';
import { Z_INDEX } from '../../constants/ui';

const renderTooltipContent = ({ gasPrice, usdPrice }) => {
	return (
		<TooltipInner>
			<TooltipValue>{gasPrice} GWEI</TooltipValue>
			<TooltipValue>${formatCurrency(usdPrice)}</TooltipValue>
		</TooltipInner>
	);
};

const WalletPopup = ({
	popupIsVisible,
	toggleGweiPopup,
	setGasPrice,
	gasInfo: {
		gasPrice = 1,
		gasLimit,
		gasSpeed: { fastestAllowed, averageAllowed, slowAllowed },
	} = {},
	ethRate,
	theme: { colors },
}) => {
	const [gasSettings, setGasSettings] = useState({});

	useEffect(() => {
		if (!gasPrice || !gasLimit || !ethRate) return;
		setGasSettings({
			gasPrice,
			usdPrice: getTransactionPrice(gasPrice, gasLimit, ethRate),
		});
	}, [gasPrice, gasLimit, ethRate]);
	return (
		<>
			<GlobalStyle />
			<Popup isVisible={popupIsVisible}>
				<Container>
					<CloseButton onClick={() => toggleGweiPopup(false)}>
						<CloseIcon src="/images/close-cross.svg" />
					</CloseButton>
					<Body>
						<HeadingMedium style={{ marginBottom: '18px' }}>
							Set transaction speed & price
						</HeadingMedium>
						<BodyMedium>
							Adjust the slider below, or use the input field to set the transaction speed.
						</BodyMedium>
						<SliderContainer>
							<Slider
								min={0}
								max={fastestAllowed}
								defaultValue={gasSettings.gasPrice}
								tooltipRenderer={() => renderTooltipContent(gasSettings)}
								onChange={newPrice => {
									setGasSettings({
										gasPrice: newPrice,
										usdPrice: getTransactionPrice(newPrice, gasLimit, ethRate),
									});
								}}
							/>
						</SliderContainer>
						<Table height={'auto'}>
							<Thead>
								<Tr>
									<Th>
										<DataSmall color={colors.fontTertiary}>Speed (allowed)</DataSmall>
									</Th>
									<Th>
										<DataSmall color={colors.fontTertiary}>Slow</DataSmall>
									</Th>
									<Th>
										<DataSmall color={colors.fontTertiary}>Average</DataSmall>
									</Th>
									<Th>
										<DataSmall color={colors.fontTertiary}>Fast</DataSmall>
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								<Tr>
									<Td>
										<DataLabel>PRICE</DataLabel>
									</Td>
									<Td>
										<DataLabel>
											${formatCurrency(getTransactionPrice(slowAllowed, gasLimit, ethRate))}
										</DataLabel>
									</Td>
									<Td>
										<DataLabel>
											${formatCurrency(getTransactionPrice(averageAllowed, gasLimit, ethRate))}
										</DataLabel>
									</Td>
									<Td>
										<DataLabel>
											${formatCurrency(getTransactionPrice(fastestAllowed, gasLimit, ethRate))}
										</DataLabel>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<DataLabel>GWEI</DataLabel>
									</Td>
									<Td>
										<DataLabel>{formatCurrency(slowAllowed)}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{formatCurrency(averageAllowed)}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{formatCurrency(fastestAllowed)}</DataLabel>
									</Td>
								</Tr>
							</Tbody>
						</Table>
						<InputRow>
							{/* <Input
							value={gasSettings.gasPrice}
							onChange={e => {
								setGasSettings({
									gasPrice: Number(e.target.value),
									usdPrice: getTransactionPrice(Number(e.target.value), gasLimit, ethRate),
								});
							}}
						></Input> */}
							<ButtonPrimary
								width={'auto'}
								style={{ flex: 1 }}
								onClick={() => {
									setGasPrice(gasSettings.gasPrice);
									toggleGweiPopup(false);
								}}
							>
								Submit changes
							</ButtonPrimary>
						</InputRow>
					</Body>
				</Container>
			</Popup>
		</>
	);
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Popup = styled.div`
	z-index: ${Z_INDEX.MODAL};
	background-color: ${props => props.theme.colors.surfaceL1};
	position: absolute;
	display: ${props => (props.isVisible ? 'block' : 'none')};
	animation: ${props => (props.isVisible ? fadeIn : fadeOut)} 0.2s ease-in;
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
`;

const Container = styled.div`
	width: 640px;
	max-width: 1024px;
	margin: 0 auto;
	display: flex;
	height: 100%;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

const Body = styled.div`
	text-align: center;
`;

const SliderContainer = styled.div`
	margin: 100px 0 50px 0;
`;

const CloseButton = styled.button`
	border: none;
	background: none;
	cursor: pointer;
	position: absolute;
	right: 5%;
	top: 5%;
`;

const CloseIcon = styled.img`
	width: 22px;
	height: 22px;
`;

const InputRow = styled.div`
	margin: 40px 0;
	display: flex;
`;

const GlobalStyle = createGlobalStyle`
	.rc-slider-tooltip {
		z-index: ${Z_INDEX.MODAL};
	}
`;

// const Input = styled.input`
// 	background-color: ${props => props.theme.colors.surfaceL3};
// 	border: 1px solid ${props => props.theme.colors.accentLight};
// 	flex: 1;
// 	font-size: 14px;
// 	padding: 0 20px;
// 	color: ${props => props.theme.colors.fontTertiary};
// `;

const TooltipInner = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	height: 100%;
	padding: 12px;
`;

const TooltipValue = styled.div`
	margin-bottom: 4px;
`;
const mapStateToProps = state => {
	return {
		popupIsVisible: gweiPopupIsVisible(state),
		gasInfo: getGasInfo(state),
		ethRate: getEthRate(state),
	};
};

const mapDispatchToProps = {
	toggleGweiPopup,
	setGasPrice,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(WalletPopup));
