import React, { memo, FC, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';

import { breakpoint, media } from 'shared/media';
import { lightTheme } from 'styles/theme';

import { RootState } from 'ducks/types';
import {
	getAvailableSynths,
	getOrderedSynthsWithRates,
	SynthDefinition,
	SynthDefinitionWithRates,
} from 'ducks/synths';
import { fetchHistoricalRatesRequest } from 'ducks/historicalRates';

import { Z_INDEX } from 'constants/ui';
import TokensTable from './TokensTable';
import TokensCharts from './TokensCharts';

type StateProps = {
	synths: SynthDefinition[];
	synthsWithRates: SynthDefinitionWithRates[];
};

type DispatchProps = {
	fetchHistoricalRatesRequest: typeof fetchHistoricalRatesRequest;
};

type TokensSectionProps = StateProps & DispatchProps;

export const TokensSection: FC<TokensSectionProps> = memo(
	({ synths, synthsWithRates, fetchHistoricalRatesRequest }) => {
		useEffect(() => {
			fetchHistoricalRatesRequest({ synths, periods: ['ONE_DAY'] });
		}, [fetchHistoricalRatesRequest, synths]);

		return (
			<>
				<ThemeProvider theme={lightTheme}>
					<TokensChartsContent>
						<TokensCharts synthsWithRates={synthsWithRates} />
					</TokensChartsContent>
					<TokensTableContainer>
						<Content>
							<TokensTable synthsWithRates={synthsWithRates} />
						</Content>
					</TokensTableContainer>
				</ThemeProvider>
			</>
		);
	}
);

const TokensTableContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.white};
	position: relative;
	padding-top: 120px;
	padding-bottom: 110px;
`;

const Content = styled.div`
	max-width: ${breakpoint.large}px;
	margin: 0 auto;
`;

const TokensChartsContent = styled(Content)`
	position: relative;
	z-index: ${Z_INDEX.BASE};
	transform: translateY(50%);
	${media.large`
		transform: none;
		padding: 73px 24px;
	`}
	${media.medium`
		transform: none;
		padding: 40px 24px;
	`}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synths: getAvailableSynths(state),
	synthsWithRates: getOrderedSynthsWithRates(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchHistoricalRatesRequest,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(TokensSection);
