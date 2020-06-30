import React, { FC } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { getNetworkId } from 'ducks/wallet/walletDetails';

import Modal from '@material-ui/core/Modal';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

import { headingH4CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';

import { GridDivCol, resetButtonCSS, CurrencyKey, GridDivCenteredCol } from 'shared/commonStyles';

import { formatShortDateWithTime, formatCurrencyWithSign } from 'utils/formatters';
import { OptionsMarketInfo } from 'pages/Options/types';
import { labelMediumCSS } from 'components/Typography/Label';
import {
	tableDataLargeCSS,
	tableHeaderLargeCSS,
	tableDataSmallCSS,
} from 'components/Typography/Table';
import { USD_SIGN, SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import Link from 'components/Link';
import { getEtherscanAddressLink } from 'utils/explorers';

const mapStateToProps = (state: RootState) => ({
	networkId: getNetworkId(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketInfoModalProps = PropsFromRedux & {
	marketHeading: React.ReactNode;
	optionMarket: OptionsMarketInfo;
	onClose: () => void;
};

export const MarketInfoModal: FC<MarketInfoModalProps> = ({
	onClose,
	optionMarket,
	marketHeading,
	networkId,
}) => {
	const { t } = useTranslation();

	return (
		<StyledModal
			open={true}
			onClose={onClose}
			disableAutoFocus={true}
			disableEnforceFocus={true}
			disableRestoreFocus={true}
		>
			<Container>
				<Buttons>
					<ContractLink
						to={getEtherscanAddressLink(networkId, optionMarket.address)}
						isExternal={true}
					>
						{t('common.contracts.view')} <ArrowIcon width="8" height="8" />
					</ContractLink>
					<CloseButton>
						<CloseCrossIcon onClick={onClose} />
					</CloseButton>
				</Buttons>
				<MarketHeading>{marketHeading}</MarketHeading>
				<Title>{t('options.market.info-modal.title')}</Title>
				<InfoTables>
					<Table>
						<thead></thead>
						<tbody>
							<TableRow>
								<TableCellLabel>{t('options.market.info-modal.table.currency-col')}</TableCellLabel>
								<TableCellValue>{optionMarket.asset}</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.strike-price-col')}
								</TableCellLabel>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>{t('options.market.info-modal.table.phase-col')}</TableCellLabel>
								<TableCellValue style={{ textTransform: 'capitalize' }}>
									{optionMarket.phase}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.bidding-end-col')}
								</TableCellLabel>
								<TableCellValue>
									{formatShortDateWithTime(optionMarket.biddingEndDate)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>{t('options.market.info-modal.table.maturity-col')}</TableCellLabel>
								<TableCellValue>
									{formatShortDateWithTime(optionMarket.maturityDate)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>{t('options.market.info-modal.table.expiry-col')}</TableCellLabel>
								<TableCellValue>{formatShortDateWithTime(optionMarket.expiryDate)}</TableCellValue>
							</TableRow>
						</tbody>
					</Table>
					<Table>
						<thead>
							<TableRow>
								<TableCellHead />
								<TableCellHead>{t('options.common.long')}</TableCellHead>
								<TableCellHead>{t('options.common.short')}</TableCellHead>
							</TableRow>
						</thead>
						<tbody>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.option-prices-col')}
								</TableCellLabel>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.longPrice)}
								</TableCellValue>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.shortPrice)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.total-outstanding-bids-col')}
								</TableCellLabel>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.totalBids.long)}
								</TableCellValue>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.totalBids.short)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.total-outstanding-options-col')}
								</TableCellLabel>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.totalSupplies.long)}
								</TableCellValue>
								<TableCellValue>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.totalSupplies.short)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									<Trans
										i18nKey="options.market.info-modal.table.deposited-currency-col"
										values={{ currencyKey: SYNTHS_MAP.sUSD }}
										components={[<CurrencyKey />]}
									/>
								</TableCellLabel>
								<TableCellValue colSpan={2}>
									{formatCurrencyWithSign(USD_SIGN, optionMarket.deposits.deposited)}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									<Trans
										i18nKey="options.market.info-modal.table.final-price-col"
										values={{ currencyKey: optionMarket.asset }}
										components={[<CurrencyKey />]}
									/>
								</TableCellLabel>
								<TableCellValue colSpan={2}>
									{optionMarket.finalPrice !== 0
										? formatCurrencyWithSign(USD_SIGN, optionMarket.finalPrice)
										: EMPTY_VALUE}
								</TableCellValue>
							</TableRow>
							<TableRow>
								<TableCellLabel>
									{t('options.market.info-modal.table.current-result-col')}
								</TableCellLabel>
								<TableCellValue colSpan={2} style={{ textTransform: 'uppercase' }}>
									{optionMarket.result}
								</TableCellValue>
							</TableRow>
						</tbody>
					</Table>
				</InfoTables>
			</Container>
		</StyledModal>
	);
};

const InfoTables = styled(GridDivCol)`
	grid-gap: 39px;
	align-items: end;
`;

const TableRow = styled.tr``;
const TableCell = styled.td`
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	padding: 12px;
`;
const TableCellHead = styled.th`
	padding: 12px;
	color: ${(props) => props.theme.colors.fontTertiary};
	${tableHeaderLargeCSS};
	font-weight: normal;
	text-align: left;
`;
const TableCellLabel = styled(TableCell)`
	color: ${(props) => props.theme.colors.fontTertiary};
	${tableHeaderLargeCSS};
	white-space: nowrap;
`;
const TableCellValue = styled(TableCell)`
	color: ${(props) => props.theme.colors.fontPrimary};
	${tableDataLargeCSS};
`;

const Table = styled.table.attrs({
	cellSpacing: 0,
	cellPadding: 0,
})`
	border-collapse: collapse;
`;

const StyledModal = styled(Modal)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL3};
	outline: none;
	padding: 55px;
	position: relative;
`;

const MarketHeading = styled.div`
	${bodyCSS};
	${labelMediumCSS};
	padding-bottom: 9px;
	color: ${({ theme }) => theme.colors.fontSecondary};
`;

const Title = styled.div`
	${headingH4CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 28px;
	text-transform: uppercase;
`;

const Buttons = styled(GridDivCenteredCol)`
	position: absolute;
	right: 55px;
	top: 55px;
	grid-gap: 24px;
`;

const ContractLink = styled(Link)`
	color: ${(props) => props.theme.colors.hyperlink};
	border: 1px solid ${(props) => props.theme.colors.hyperlink};
	${tableDataSmallCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	border-radius: 1px;
	padding: 4px 10px;
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
	margin-left: 2px;
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	color: ${({ theme }) => theme.colors.fontTertiary};
	width: 16px;
	height: 16px;
`;

export default connector(MarketInfoModal);
