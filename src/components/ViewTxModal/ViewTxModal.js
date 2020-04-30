import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import snxJSConnector from 'src/utils/snxJSConnector';
import { media } from 'src/shared/media';
import { useMediaQuery } from 'react-responsive';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import Spinner from 'src/components/Spinner';
import Currency from 'src/components/Currency';

import { resetButtonCSS } from 'src/shared/commonStyles';

import { hideViewTxModal, getViewTxModalProps } from 'src/ducks/ui';
import { bigNumberFormatter, shortenAddress, formatCurrencyWithKey } from 'src/utils/formatters';

import { smallMediaQuery } from 'src/shared/media';

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
	const isMobile = useMediaQuery({ query: smallMediaQuery });

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

			const transfers = !isMobile
				? txDetails.logs
						.map(log => {
							const contract = Object.keys(addressList).find(
								key => addressList[key] === log.address
							);

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
						}))
				: [];

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
					<Spinner size="sm" />
				) : (
					<Table cellSpacing={0} cellPadding={0}>
						<tbody>
							<tr>
								<TableCellLabel>transaction hash</TableCellLabel>
								<TableCellDesc>{hash}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>status</TableCellLabel>
								<TableCellDesc>{txDetails.status === 1 && 'success'}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>block</TableCellLabel>
								<TableCellDesc>{txDetails.blockNumber}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>from</TableCellLabel>
								<TableCellDesc>{txDetails.from}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>to</TableCellLabel>
								<TableCellDesc>{txDetails.to}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>confirmations</TableCellLabel>
								<TableCellDesc>{txDetails.confirmations}</TableCellDesc>
							</tr>
							{txDetails.transfers.length > 0 && (
								<tr>
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
								</tr>
							)}
						</tbody>
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
	background: ${props => props.theme.colors.surfaceL3};
	border: 0.5px solid #cb5bf2;
	padding: 48px;
	${media.medium`
		width: 100%;
		border: 0;
	`}
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	top: 35px;
	right: 35px;
	svg {
		width: 15px;
		height: 15px;
	}
`;

const Heading = styled.div`
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
	letter-spacing: 0.2px;
	color: #fff;
	padding-bottom: 30px;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
`;

const TableCell = styled.td`
	border: 1px solid #cb5bf2;
	border-collapse: collapse;
	padding: 8px 12px;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	word-break: break-all;
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
	color: #fff;
`;

const TransferLabel = styled.div`
	&:not(:first-child) {
		margin-top: 10px;
	}
	display: flex;
	align-items: center;
	& > svg {
		margin-left: 5px;
	}
`;
const mapStateToProps = state => ({
	viewTxModalProps: getViewTxModalProps(state),
});

const mapDispatchToProps = {
	hideViewTxModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTxModal);
