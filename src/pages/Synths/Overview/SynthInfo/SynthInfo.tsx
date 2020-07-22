import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { connect } from 'react-redux';

import snxJSConnector from 'utils/snxJSConnector';

import { SynthDefinition } from 'ducks/synths';
import { RootState } from 'ducks/types';

import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';

import { media } from 'shared/media';
import { GridDiv } from 'shared/commonStyles';

import Link from 'components/Link';
import { tableHeaderSmallCSS, tableDataSmallCSS } from 'components/Typography/Table';
import { bodyCSS } from 'components/Typography/General';
import { subtitleLargeCSS } from 'components/Typography/General';

import { getNetworkId } from 'ducks/wallet/walletDetails';
import { getEtherscanTokenLink } from 'utils/explorers';
import { getDecimalPlaces } from 'utils/formatters';
import { NetworkId } from 'utils/networkUtils';

type StateProps = {
	networkId: NetworkId;
};

type Props = {
	synth: SynthDefinition;
};

type SynthInfoProps = StateProps & Props;

export const roundedLimit = (entry: number, limit: number) => {
	const num = entry * 2 - limit;

	return Number(num).toFixed(getDecimalPlaces(limit));
};

const SYNTH_CONTRACT_DECIMALS = 18;

export const SynthInfo: FC<SynthInfoProps> = ({ synth, networkId }) => {
	const { t } = useTranslation();

	const assetDesc = synth.desc.replace(/^Inverse /, '');
	const assetSymbol = synth.desc !== synth.asset ? ` (${synth.asset})` : '';

	// @ts-ignore
	const { snxJS } = snxJSConnector;
	// @ts-ignore
	const contractAddress = snxJS[synth.name].contract.address;

	const synthSign = USD_SIGN;

	const addSign = (num: number | string) => `${synthSign}${num}`;

	const getInfo = () => {
		if (synth.name === SYNTHS_MAP.sUSD) {
			return t('synths.overview.info.sUSD');
		}
		if (synth.inverted) {
			const { entryPoint, upperLimit, lowerLimit } = synth.inverted;

			return t('synths.overview.info.iSynth', {
				assetDesc,
				assetSymbol,
				entryPoint: addSign(entryPoint),
				upperLimit: addSign(upperLimit),
				lowerLimit: addSign(lowerLimit),
				roundedUpper: addSign(roundedLimit(entryPoint, upperLimit)),
				roundedLower: addSign(roundedLimit(entryPoint, lowerLimit)),
			});
		}
		if (synth.index) {
			return (
				<>
					{t('synths.overview.info.index', {
						assetDesc,
						assetSymbol,
					})}
					<Table style={{ marginTop: '48px' }}>
						<thead>
							<TableRowHead>
								<th>{t('common.asset')}</th>
								<th>{t('common.units')}</th>
							</TableRowHead>
						</thead>
						<tbody>
							{synth.index.map(({ symbol, name, units }) => (
								<TableRowBody key={symbol}>
									<td>
										{symbol} ({name})
									</td>
									<td>{units}</td>
								</TableRowBody>
							))}
						</tbody>
					</Table>
				</>
			);
		}
		return t('synths.overview.info.generic', {
			assetDesc,
			assetSymbol,
		});
	};

	return (
		<Container>
			<div>
				<Title>
					<Trans
						i18nKey="synths.overview.info.title"
						values={{
							name: synth.name,
							desc: t('common.currency.synthetic-currency', {
								currencyKey: synth.desc,
							}),
						}}
						components={[<Description />]}
					/>
				</Title>
				<Info>{getInfo()}</Info>
			</div>
			<ContractInfo>
				<Table>
					<thead>
						<TableRowHead>
							<th>{t('common.currency.decimals')}</th>
							<th>{t('common.currency.contract-address')}</th>
						</TableRowHead>
					</thead>
					<tbody>
						<TableRowBody>
							<td style={{ width: '100px' }}>{SYNTH_CONTRACT_DECIMALS}</td>
							<td>
								<StyledLink
									isExternal={true}
									to={getEtherscanTokenLink(networkId, contractAddress)}
								>
									{contractAddress}
								</StyledLink>
							</td>
						</TableRowBody>
					</tbody>
				</Table>
				{synth.inverted && (
					<Table style={{ tableLayout: 'fixed' }}>
						<thead>
							<TableRowHead>
								<th>{t('common.currency.lower-limit')}</th>
								<th>{t('common.currency.entry')}</th>
								<th>{t('common.currency.upper-limit')}</th>
							</TableRowHead>
						</thead>
						<tbody>
							<TableRowBody>
								<td>{addSign(synth.inverted.lowerLimit)}</td>
								<td>{addSign(synth.inverted.entryPoint)}</td>
								<td>{addSign(synth.inverted.upperLimit)}</td>
							</TableRowBody>
						</tbody>
					</Table>
				)}
			</ContractInfo>
		</Container>
	);
};

const Container = styled(GridDiv)`
	grid-auto-flow: column;
	grid-gap: 40px;
	${media.large`
		grid-gap: 20px;
		grid-auto-flow: row;
    padding: 0 20px;
		
  `}
`;

const Title = styled.div`
	${subtitleLargeCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 16px;
`;

const Description = styled.span`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const Info = styled.div`
	${bodyCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const ContractInfo = styled.div`
	display: grid;
	grid-gap: 20px;
	padding-top: 5px;
	width: 450px;
	justify-self: end;
	${media.large`
    width: 100%;
  `}
`;

const Table = styled.table.attrs({
	cellSpacing: 0,
	cellPadding: 0,
})`
	border-collapse: collapse;
	width: 100%;
	${media.medium`
    margin-top: 24px;
  `}
`;

const TableRow = styled.tr`
	text-align: left;
	> * {
		padding: 15px;
		border: 1px solid ${(props) => props.theme.colors.accentL2};
	}
`;

const TableRowHead = styled(TableRow)`
	> th {
		${tableHeaderSmallCSS};
		font-weight: normal;
		background-color: ${(props) => props.theme.colors.accentL1};
		color: ${(props) => props.theme.colors.fontSecondary};
	}
`;

const TableRowBody = styled(TableRow)`
	> td {
		${tableDataSmallCSS};
		color: ${(props) => props.theme.colors.fontPrimary};
		word-break: break-all;
	}
`;

const StyledLink = styled(Link)`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	networkId: getNetworkId(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(SynthInfo);
