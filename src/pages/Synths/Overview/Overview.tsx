import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import styled, { ThemeProvider, css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { CurrencyKey, toStandardSynth, toInverseSynth } from 'constants/currency';
import ROUTES, { navigateTo, navigateToSynthOverview } from 'constants/routes';

import Spinner from 'components/Spinner';
import { labelMediumCSS } from 'components/Typography/Label';

import { media } from 'shared/media';
import { resetButtonCSS, FlexDivRow, PageContent } from 'shared/commonStyles';

import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';

import { Z_INDEX } from 'constants/ui';

import { SynthDefinitionMap, getAvailableSynthsMap, SynthDefinition } from 'ducks/synths';
import { RootState } from 'ducks/types';

import { lightTheme, darkTheme } from 'styles/theme';

import SynthChart from './SynthChart/SynthChart';
import SynthInfo from './SynthInfo';
import SynthMarkets from './SynthMarkets';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = RouteComponentProps<{
	currencyKey: CurrencyKey;
}>;

type OverviewProps = StateProps & Props;

const navigateToSynthsPage = () => navigateTo(ROUTES.Synths.Home, false, true);

export const Overview: FC<OverviewProps> = ({ match, synthsMap }) => {
	const [synth, setSynth] = useState<SynthDefinition | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		const { params } = match;

		if (!isEmpty(synthsMap)) {
			// check for a valid synth
			if (!!synthsMap[params.currencyKey]) {
				setSynth(synthsMap[params.currencyKey]);
			} else {
				navigateToSynthsPage();
			}
		}
	}, [match, synthsMap]);

	return (
		<>
			{synth ? (
				<ThemeProvider theme={lightTheme}>
					<SynthsChartsContent>
						<ThemeProvider theme={darkTheme}>
							<SynthChartActions>
								<BackLinkButton role="button" onClick={navigateToSynthsPage}>
									<ArrowBackIcon />
									{t('synths.overview.chart.back-to-synths')}
								</BackLinkButton>
								{/* TODO: index should be crypto... */}
								{['crypto', 'index'].includes(synth.category) && (
									<InverseToggleContainer>
										<ToggleButton
											isActive={!synth.inverted}
											onClick={() => navigateToSynthOverview(toStandardSynth(synth.name), true)}
										>
											{t('synths.overview.chart.toggle.standard')}
										</ToggleButton>
										<ToggleButton
											isActive={!!synth.inverted}
											onClick={() => navigateToSynthOverview(toInverseSynth(synth.name), true)}
										>
											{t('synths.overview.chart.toggle.inverse')}
										</ToggleButton>
									</InverseToggleContainer>
								)}
							</SynthChartActions>
						</ThemeProvider>
						<SynthChart synth={synth} key={synth.name} />
					</SynthsChartsContent>
					<SynthInfoContainer>
						<PageContent>
							<SynthInfo synth={synth} key={synth.name} />
						</PageContent>
					</SynthInfoContainer>
					<SynthMarketsContainer>
						<PageContent>
							<SynthMarkets synth={synth} key={synth.name} />
						</PageContent>
					</SynthMarketsContainer>
				</ThemeProvider>
			) : (
				<LoaderContainer>
					<Spinner size="sm" centered={true} />
				</LoaderContainer>
			)}
		</>
	);
};

const CHART_CONTAINER_HEIGHT = '350px';

const SynthsChartsContent = styled(PageContent)`
	position: relative;
	z-index: ${Z_INDEX.BASE};
	height: ${CHART_CONTAINER_HEIGHT};
	transform: translateY(60px);

	${media.large`
		height: auto;
		transform: none;
	`}
`;

const SynthChartActions = styled(FlexDivRow)`
	padding: 20px 0;
	${media.large`
		padding: 20px 13px;
	`}
`;

const BackLinkButton = styled.button`
	${resetButtonCSS};
	${labelMediumCSS};
	text-transform: none;
	color: ${(props) => props.theme.colors.fontPrimary};
	> svg {
		margin-right: 8px;
	}
`;

const SynthInfoContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.white};
	position: relative;
	padding-top: 280px;
	padding-bottom: 60px;
	${media.large`
		padding-top: 20px;
	`}
`;

const SynthMarketsContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.surfaceL2};
	position: relative;
	padding: 60px 0;
`;

const LoaderContainer = styled.div`
	position: relative;
	height: ${CHART_CONTAINER_HEIGHT};
`;

const InverseToggleContainer = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border-radius: 1px;
	border: 1px solid ${(props) => props.theme.colors.accentL1};
	padding: 4px;
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 10px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
	${resetButtonCSS};
	${labelMediumCSS};
	padding: 5px 13px;
	color: ${(props) => props.theme.colors.fontSecondary};
	&:hover {
		color: ${(props) => props.theme.colors.fontPrimary};
		background-color: ${(props) => props.theme.colors.accentL1};
	}
	${(props) =>
		props.isActive &&
		css`
			color: ${(props) => props.theme.colors.fontPrimary};
			background-color: ${(props) => props.theme.colors.accentL2};
			&:hover {
				background-color: ${(props) => props.theme.colors.accentL2};
			}
		`}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(Overview);
