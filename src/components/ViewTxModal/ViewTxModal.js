import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import snxJSConnector from 'src/utils/snxJSConnector';
import { media } from 'src/shared/media';
import { useMediaQuery } from 'react-responsive';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import HeartBeat from 'src/components/HeartBeat';
import Currency from 'src/components/Currency';

import { resetButtonCSS } from 'src/shared/commonStyles';

import { hideViewTxModal, getViewTxModalProps } from 'src/ducks/ui';
import { bigNumberFormatter, shortenAddress, formatCurrencyWithKey } from 'src/utils/formatters';

const TRANSFER_EVENT = 'Transfer';

const useStyles = makeStyles(() => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

const ViewTxModal = ({ viewTxModalProps: { hash }, hideViewTxModal }) => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);
	const [txDetails, setTxDetails] = useState(null);

	useEffect(() => {
		const loadTx = async () => {
			const {
				provider,
				snxJS: {
					contractSettings: { addressList },
				},
			} = snxJSConnector;

			await provider.waitForTransaction(hash);
			const txDetails = await provider.getTransactionReceipt(hash);

			const transfers = txDetails.logs
				.map(log => {
					const contract = Object.keys(addressList).find(key => addressList[key] === log.address);

					return {
						contract,
						event: snxJSConnector.snxJS.Synthetix.contract.interface.parseLog(log),
					};
				})
				.filter(({ event }) => event && event.name === TRANSFER_EVENT)
				.map(({ contract, event: { values: { from, to, value } } }) => ({
					synth: contract.split('Proxy')[1],
					from,
					to,
					value: bigNumberFormatter(value),
				}));
			setTxDetails({ ...txDetails, transfers });
			setIsLoading(false);
		};

		loadTx();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Modal open={true} onClose={hideViewTxModal} className={classes.modal}>
			<Container>
				<Heading>Transaction Details:</Heading>
				<CloseButton onClick={hideViewTxModal}>
					<CloseCrossIcon />
				</CloseButton>
				{isLoading ? (
					<HeartBeat surface={3} />
				) : (
					<Table>
						<TableCellRow>
							<TableCellLabel>transaction hash</TableCellLabel>
							<TableCellDesc>{hash}</TableCellDesc>
						</TableCellRow>
						<TableCellRow>
							<TableCellLabel>status</TableCellLabel>
							<TableCellDesc>{txDetails.status === 1 && 'success'}</TableCellDesc>
						</TableCellRow>
						<TableCellRow>
							<TableCellLabel>block</TableCellLabel>
							<TableCellDesc>{txDetails.blockNumber}</TableCellDesc>
						</TableCellRow>
						<TableCellRow>
							<TableCellLabel>from</TableCellLabel>
							<TableCellDesc>{txDetails.from}</TableCellDesc>
						</TableCellRow>
						<TableCellRow>
							<TableCellLabel>to</TableCellLabel>
							<TableCellDesc>{txDetails.to}</TableCellDesc>
						</TableCellRow>
						<TableCellRow>
							<TableCellLabel>confirmations</TableCellLabel>
							<TableCellDesc>{txDetails.confirmations}</TableCellDesc>
						</TableCellRow>
						{txDetails.transfers.length > 0 && (
							<TableCellRow>
								<TableCellLabel>transfers</TableCellLabel>
								<TableCellDesc>
									{txDetails.transfers.map(({ synth, from, to, value }, idx) => (
										<TransferLabel key={`label${idx}`}>
											{`From ${shortenAddress(from)} To ${shortenAddress(
												to
											)} For ${formatCurrencyWithKey(synth, value)}`}
											<Currency.Icon currencyKey={synth} />
										</TransferLabel>
									))}
								</TableCellDesc>
							</TableCellRow>
						)}
					</Table>
				)}
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	outline: 0;
	position: relative;
	width: 830px;
	min-height: 300px;
	background: ${props => props.theme.colors.surfaceL3};
	border: 0.5px solid #cb5bf2;
	padding: 48px;
	${media.medium`
		width: 100%;
		height: 100%;
		border: 0;
		overflow-y: auto;
		padding: 24px;
	`}
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	top: 35px;
	right: 35px;
	svg {
		width: 20px;
		height: 20px;
	}
	${media.medium`
		position: fixed;
		top: 20px;
		right: 20px;
	`}
`;

const Heading = styled.div`
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
	letter-spacing: 0.2px;
	color: #fff;
	padding-bottom: 30px;
`;

const Table = styled.div`
	width: 100%;
	border-bottom: 1px solid #cb5bf2;
	${media.medium`
		border: 0;
	`}
`;

const TableCell = styled.div`
	border: 1px solid #cb5bf2;
	padding: 8px 12px;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	word-break: break-all;
	${media.medium`
		border: 0;
		padding: 5px;
	`}
	border-bottom: 0;
`;

const TableCellRow = styled.div`
	display: grid;
	grid-template-columns: 165px 1fr;
	${media.medium`
		grid-template-columns: initial;
		grid-template-rows: auto 1fr;
		padding-bottom: 10px;
	`}
`;

const TableCellLabel = styled(TableCell)`
	color: #cacaf1;
	white-space: nowrap;
	min-width: 100px;
	word-break: normal;
	${media.medium`
		white-space: normal;
	`}
`;

const TableCellDesc = styled(TableCell)`
	border-left: 0;
	color: #fff;
`;

const TransferLabel = styled.div`
	&:not(:first-child) {
		margin-top: 10px;
	}
	display: inline-grid;
	align-items: center;
	grid-auto-flow: column;
	grid-gap: 10px;
`;
const mapStateToProps = state => ({
	viewTxModalProps: getViewTxModalProps(state),
});

const mapDispatchToProps = {
	hideViewTxModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTxModal);
