import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { shortenAddress, bigNumberFormatter } from 'src/utils/formatters';

import { ReactComponent as MintrLogo } from 'src/assets/images/delegate/mintr-logo.svg';
import { ReactComponent as BackButton } from 'src/assets/images/delegate/back-button.svg';

import Spinner from 'src/components/Spinner';
import Link from 'src/components/Link';
import { Button } from 'src/components/Button';

import { ROUTES } from 'src/constants/routes';

import snxJSConnector from 'src/utils/snxJSConnector';
import { GWEI_UNIT } from 'src/utils/networkUtils';

import { normalizeGasLimit } from 'src/utils/transactions';

import { getGasInfo } from 'src/ducks/index';

const ManageWallet = memo(({ match, gasInfo }) => {
	const [collateralisationRatio, setCollateralisationRatio] = useState(null);
	const [issuanceRatio, setIssuanceRatio] = useState(null);
	const [maxIssuableSynths, setMaxIssuableSynths] = useState(null);
	const [isFeesClaimable, setIsFeesClaimable] = useState(null);
	const [sUSDBalance, setsUSDBalance] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const {
		snxJS: { Synthetix, SynthetixState, FeePool, sUSD },
	} = snxJSConnector;

	const {
		params: { walletAddr },
	} = match;

	console.log(snxJSConnector);

	useEffect(() => {
		const init = async () => {
			setIsLoading(true);

			const collateralisationRatio = await Synthetix.collateralisationRatio(walletAddr);
			const issuanceRatio = await SynthetixState.issuanceRatio();
			const maxIssueSynths = await Synthetix.maxIssuableSynths(walletAddr);
			const isFeesClaimable = await FeePool.isFeesClaimable(walletAddr);
			const sUSDBalance = await sUSD.balanceOf(walletAddr);

			setCollateralisationRatio(bigNumberFormatter(collateralisationRatio));
			setIssuanceRatio(bigNumberFormatter(issuanceRatio));
			setMaxIssuableSynths(bigNumberFormatter(maxIssueSynths));
			setIsFeesClaimable(isFeesClaimable);
			setsUSDBalance(sUSDBalance);

			setIsLoading(false);
		};
		init();
	}, []);

	const handleBurnToTarget = async () => {
		const gasEstimate = await Synthetix.contract.estimate.burnSynthsToTargetOnBehalf(walletAddr);
		const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

		await Synthetix.contract.estimate.burnSynthsToTargetOnBehalf(walletAddr, {
			gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			gasLimit: updatedGasEstimate,
		});
	};

	const handleClaimFees = async () => {
		const gasEstimate = await FeePool.contract.estimate.claimOnBehalf(walletAddr);
		const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

		await FeePool.contract.estimate.claimOnBehalf(walletAddr, {
			gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			gasLimit: updatedGasEstimate,
		});
	};

	const handleMintMax = async () => {
		const gasEstimate = await Synthetix.contract.estimate.issueMaxSynthsOnBehalf(walletAddr);
		const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

		await Synthetix.contract.estimate.issueMaxSynthsOnBehalf(walletAddr, {
			gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			gasLimit: updatedGasEstimate,
		});
	};

	return (
		<>
			<Link to={ROUTES.Home} style={{ width: 'auto', marginRight: 'auto' }}>
				<StyledBackButton />
			</Link>
			<StyledLogo />
			<Headline>
				Delegation enables a wallet to execute functions on behalf of another wallet: mint, burn,
				claim, and exchange.
			</Headline>
			<Wallet>{shortenAddress(walletAddr)}</Wallet>
			<CollatBox>
				<CollatBoxLabel>current c-ratio</CollatBoxLabel>
				<CollatBoxValue>
					{collateralisationRatio != null
						? `${collateralisationRatio > 0 ? Math.round(100 / collateralisationRatio) : 0}%`
						: '-'}
				</CollatBoxValue>
			</CollatBox>
			<CollatBox>
				<CollatBoxLabel>target c-ratio</CollatBoxLabel>
				<CollatBoxValue>
					{issuanceRatio != null ? `${Math.round(100 / issuanceRatio)}%` : '-'}
				</CollatBoxValue>
			</CollatBox>
			<Buttons>
				{isFeesClaimable && (
					<Button size="lg" palette="primary" disabled={isLoading} onClick={handleBurnToTarget}>
						Burn to target
					</Button>
				)}
				<Button
					size="lg"
					palette="primary"
					disabled={isFeesClaimable === false || isLoading}
					onClick={handleClaimFees}
				>
					Claim fees
				</Button>
				<Button
					size="lg"
					palette="primary"
					disabled={maxIssuableSynths === 0 || isLoading}
					onClick={handleMintMax}
				>
					Mint max
				</Button>
			</Buttons>
		</>
	);
});

const CollatBox = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	background-color: ${props => props.theme.colors.surfaceL1};
	border: 1px solid ${props => props.theme.colors.accentL2};
	height: 88px;
	box-sizing: border-box;
	margin-bottom: 24px;
	padding: 15px;
`;

const CollatBoxLabel = styled.span`
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	letter-spacing: 0.2px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontSecondary};
	text-transform: uppercase;
`;

const CollatBoxValue = styled.span`
	font-weight: 500;
	font-size: 32px;
	letter-spacing: 0.2px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
`;

const StyledLogo = styled(MintrLogo)`
	width: 174px;
	height: 48px;
`;

const StyledBackButton = styled(BackButton)``;

const Headline = styled.div`
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 16px;
	padding-bottom: 50px;
	padding-top: 11px;
`;

const Wallet = styled.div`
	font-weight: 500;
	font-size: 20px;
	letter-spacing: 0.2px;
	margin-bottom: 24px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	background-color: ${props => props.theme.colors.accentL1};
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	box-sizing: border-box;
`;

const Buttons = styled.div`
	margin-top: 24px;
	display: grid;
	grid-gap: 24px;
`;

const mapStateToProps = state => ({
	gasInfo: getGasInfo(state),
});

export default connect(mapStateToProps, null)(ManageWallet);
