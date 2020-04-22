import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import snxJSConnector from 'src/utils/snxJSConnector';
import { media } from 'src/shared/media';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import Spinner from 'src/components/Spinner';

import { resetButtonCSS } from 'src/shared/commonStyles';

import { hideViewTxModal, getViewTxModalProps } from 'src/ducks/ui';

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
			const { provider } = snxJSConnector;
			await provider.waitForTransaction(hash);
			const txDetails = await provider.getTransactionReceipt(hash);

			setTxDetails(txDetails);
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
					<table cellSpacing={0} cellPadding={0} style={{ width: '100%' }}>
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
								<TableCellLabel>transaction fee</TableCellLabel>
								<TableCellDesc>{+txDetails.gasUsed}</TableCellDesc>
							</tr>
							<tr>
								<TableCellLabel>confirmations</TableCellLabel>
								<TableCellDesc>{txDetails.confirmations}</TableCellDesc>
							</tr>
						</tbody>
					</table>
				)}
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	outline: 0;
	position: relative;
	width: 820px;
	background: ${(props) => props.theme.colors.surfaceL3};
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

const TableCell = styled.td`
	border: 1px solid #cb5bf2;
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

const mapStateToProps = (state) => ({
	viewTxModalProps: getViewTxModalProps(state),
});

const mapDispatchToProps = {
	hideViewTxModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTxModal);
