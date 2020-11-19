import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { CenteredPageLayout, SectionVerticalSpacer, FlexDiv } from 'shared/commonStyles';

import { RootState } from 'ducks/types';

import { CurrencyKey, getMarketPairByMC } from 'constants/currency';
import { navigateToFutures } from 'constants/routes';

import Spinner from 'components/Spinner';

import ChartCard from '../Trade/components/ChartCard';
import OrderCard from './components/OrderCard';

import { getSynthPair, setSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { FUTURES_MARKETS_MAP } from 'ducks/markets';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	setSynthPair,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type FuturesProps = PropsFromRedux &
	RouteComponentProps<{
		baseCurrencyKey: CurrencyKey;
		quoteCurrencyKey: CurrencyKey;
	}>;

const Futures: FC<FuturesProps> = ({ match, setSynthPair, synthPair, synthsMap }) => {
	const [isReady, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		const { params } = match;
		if (
			params &&
			params.baseCurrencyKey &&
			params.quoteCurrencyKey &&
			synthsMap[params.baseCurrencyKey] &&
			synthsMap[params.quoteCurrencyKey] &&
			FUTURES_MARKETS_MAP[params.baseCurrencyKey]
		) {
			const { base, quote, reversed } = getMarketPairByMC(
				params.baseCurrencyKey,
				params.quoteCurrencyKey
			);

			setSynthPair({
				baseCurrencyKey: base,
				quoteCurrencyKey: quote,
				isPairReversed: reversed,
			});

			setIsReady(true);
		} else {
			navigateToFutures(synthPair.base.name, synthPair.quote.name, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, setSynthPair]);

	if (!isReady) {
		return <Spinner size="sm" centered={true} />;
	}

	return (
		<Container>
			<CenteredPageLayout>
				<FuturesContainer>
					<RowContainer>
						<ChartContainer>
							<ChartCard />
						</ChartContainer>
					</RowContainer>
					<SectionVerticalSpacer />
					<RowContainer>
						<OrderCard />
					</RowContainer>
				</FuturesContainer>
			</CenteredPageLayout>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	overflow: hidden;
`;
const RowContainer = styled(FlexDiv)`
	width: 100%;
`;
const FuturesContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
`;
const ChartContainer = styled.div`
	width: 100%;
`;

export default connector(Futures);
