import React, { useState, FC, useMemo, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import add from 'date-fns/add';
import orderBy from 'lodash/orderBy';
import { makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark.svg';
import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';

import ROUTES, { navigateTo } from 'constants/routes';
import {
	SYNTHS_MAP,
	CRYPTO_CURRENCY_MAP,
	FIAT_CURRENCY_MAP,
	CurrencyKey,
	USD_SIGN,
} from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { navigateToOptionsMarket } from 'constants/routes';

import { bigNumberFormatter, parseBytes32String } from 'utils/formatters';
import { normalizeGasLimit } from 'utils/transactions';
import snxJSConnector from 'utils/snxJSConnector';
import { GWEI_UNIT } from 'utils/networkUtils';

import { lightTheme, darkTheme } from 'styles/theme';
import colors from 'styles/theme/colors';

import { RootState } from 'ducks/types';
import { getAvailableSynths } from 'ducks/synths';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { getGasInfo } from 'ducks/transaction';

import DatePicker from 'components/Input/DatePicker';
import { headingH3CSS, headingH5CSS, headingH6CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';
import NumericInput from 'components/Input/NumericInput';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { formLabelLargeCSS, formDataCSS } from 'components/Typography/Form';
import Select from 'components/Select';
import Currency from 'components/Currency';
import Button from 'components/Button/Button';

import {
	GridDivCol,
	GridDivRow,
	FlexDivRowCentered,
	FullScreenModal,
	FullScreenModalContainer,
	FlexDivCentered,
	resetButtonCSS,
} from 'shared/commonStyles';
import { media } from 'shared/media';

import { formatPercentage, formatShortDate, bytesFormatter } from 'utils/formatters';
import MarketSentiment from '../components/MarketSentiment';
import NetworkFees from '../components/NetworkFees';
import NewToBinaryOptions from '../components/NewToBinaryOptions';
import SideIcon from '../Market/components/SideIcon';
import { INPUT_SIZES } from 'components/Input/constants';
import { labelSmallCSS } from 'components/Typography/Label';

// TODO: make this a reusable style
const useStyles = makeStyles({
	tooltip: {
		fontSize: '12px',
		background: '#020B29',
		borderRadius: '4px',
		textAlign: 'center',
	},
	arrow: {
		color: '#020B29',
	},
});

// const MATURITY_DATE_DAY_DELAY = 1;

const StyledSlider = withStyles({
	root: {
		color: colors.green,
		height: 16,
		padding: '0 0 12px 0',
	},
	thumb: {
		height: 24,
		width: 24,
		background: colors.white,
		boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
		'&:focus, &:hover, &$active': {
			boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
		},
	},
	track: {
		height: 16,
		borderRadius: 2,
	},
	rail: {
		height: 16,
		backgroundColor: colors.red,
		opacity: 1,
		borderRadius: 2,
	},
})(Slider);

const mapStateToProps = (state: RootState) => ({
	synths: getAvailableSynths(state),
	currentWallet: getCurrentWalletAddress(state),
	gasInfo: getGasInfo(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type CreateMarketModalProps = PropsFromRedux & {
	onClose?: () => void;
};

type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

type MarketFees = Record<string, number>;

type TooltipIconProps = {
	title: React.ReactNode;
};

const TooltipIcon: FC<TooltipIconProps> = ({ title }) => {
	const classes = useStyles();

	return (
		<Tooltip title={<span>{title}</span>} placement="top" classes={classes} arrow={true}>
			<TooltipIconContainer>
				<QuestionMarkIcon />{' '}
			</TooltipIconContainer>
		</Tooltip>
	);
};

export const CreateMarketModal: FC<CreateMarketModalProps> = ({
	synths,
	currentWallet,
	gasInfo,
	onClose,
}) => {
	const { t } = useTranslation();
	const [currencyKey, setCurrencyKey] = useState<ValueType<CurrencyKeyOptionType>>();
	const [strikePrice, setStrikePrice] = useState<number | string>('');
	const [biddingEndDate, setEndOfBidding] = useState<Date | null | undefined>(null);
	const [maturityDate, setMaturityDate] = useState<Date | null | undefined>(null);
	const [initialLongShorts, setInitialLongShorts] = useState<{ long: number; short: number }>({
		long: 50,
		short: 50,
	});
	const [initialFundingAmount, setInitialFundingAmount] = useState<number | string>('');
	const [isManagerApproved, setIsManagerApproved] = useState<boolean>(false);
	const [isManagerApprovalPending, setIsManagerApprovalPending] = useState<boolean>(false);
	const [gasLimit, setGasLimit] = useState<number | null>(null);
	const [isCreatingMarket, setIsCreatingMarket] = useState<boolean>(false);
	const [marketFees, setMarketFees] = useState<MarketFees | null>(null);
	const [withdrawalsEnabled, setWithdrawalsEnabled] = useState<boolean>(true);

	const assetsOptions = useMemo(
		() =>
			orderBy(
				[
					{
						label: CRYPTO_CURRENCY_MAP.SNX,
						value: CRYPTO_CURRENCY_MAP.SNX,
					},
					{
						label: CRYPTO_CURRENCY_MAP.KNC,
						value: CRYPTO_CURRENCY_MAP.KNC,
					},
					{
						label: CRYPTO_CURRENCY_MAP.COMP,
						value: CRYPTO_CURRENCY_MAP.COMP,
					},
					{
						label: CRYPTO_CURRENCY_MAP.REN,
						value: CRYPTO_CURRENCY_MAP.REN,
					},
					{
						label: CRYPTO_CURRENCY_MAP.LEND,
						value: CRYPTO_CURRENCY_MAP.LEND,
					},
					...synths
						.filter((synth) => !synth.inverted && synth.name !== SYNTHS_MAP.sUSD)
						.map((synth) => ({
							label: synth.asset,
							value: synth.name,
						})),
				],
				'label',
				'asc'
			),
		[synths]
	);

	const isButtonDisabled =
		currencyKey == null ||
		strikePrice === '' ||
		biddingEndDate === null ||
		maturityDate === null ||
		initialFundingAmount === '';

	const formatCreateMarketArguments = () => {
		const {
			utils: { parseEther },
		} = snxJSConnector as any;
		const longBidAmount: number = (initialFundingAmount as number) * (initialLongShorts.long / 100);
		const shortBidAmount: number =
			(initialFundingAmount as number) * (initialLongShorts.short / 100);

		const oracleKey = bytesFormatter((currencyKey as CurrencyKeyOptionType).value);
		const price = parseEther(strikePrice.toString());
		const times = [
			Math.round((biddingEndDate as Date).getTime() / 1000),
			Math.round((maturityDate as Date).getTime() / 1000),
		];
		const bids = [parseEther(longBidAmount.toString()), parseEther(shortBidAmount.toString())];
		return { oracleKey, price, times, bids };
	};

	useEffect(() => {
		const {
			snxJS: { sUSD, BinaryOptionMarketManager },
		} = snxJSConnector as any;
		const getAllowanceForCurrentWallet = async () => {
			try {
				const [allowance, fees] = await Promise.all([
					sUSD.allowance(currentWallet, BinaryOptionMarketManager.contract.address),
					BinaryOptionMarketManager.fees(),
				]);
				setIsManagerApproved(!!bigNumberFormatter(allowance));
				setMarketFees({
					creator: fees.creatorFee / 1e18,
					pool: fees.poolFee / 1e18,
					refund: fees.refundFee / 1e18,
					bidding: fees.creatorFee / 1e18 + fees.poolFee / 1e18,
				});
			} catch (e) {
				console.log(e);
			}
		};
		const setEventListeners = () => {
			sUSD.contract.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
				if (owner === currentWallet && spender === BinaryOptionMarketManager.contract.address) {
					setIsManagerApproved(true);
				}
			});
		};
		getAllowanceForCurrentWallet();
		setEventListeners();
		return () => {
			sUSD.contract.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const {
			snxJS: { BinaryOptionMarketManager },
		} = snxJSConnector as any;
		if (!isCreatingMarket) return;
		BinaryOptionMarketManager.contract.on(
			BINARY_OPTIONS_EVENTS.MARKET_CREATED,
			(market: string, creator: string, oracleKey: string) => {
				if (
					creator === currentWallet &&
					parseBytes32String(oracleKey) === (currencyKey as CurrencyKeyOptionType).value
				) {
					navigateToOptionsMarket(market);
				}
			}
		);
		return () => {
			BinaryOptionMarketManager.contract.removeAllListeners(BINARY_OPTIONS_EVENTS.MARKET_CREATED);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCreatingMarket]);

	useEffect(() => {
		const fetchGasLimit = async () => {
			if (isButtonDisabled) return;
			const {
				snxJS: { BinaryOptionMarketManager },
			} = snxJSConnector as any;
			try {
				const { oracleKey, price, times, bids } = formatCreateMarketArguments();
				const gasEstimate = await BinaryOptionMarketManager.contract.estimate.createMarket(
					oracleKey,
					price,
					withdrawalsEnabled,
					times,
					bids
				);
				setGasLimit(normalizeGasLimit(Number(gasEstimate)));
			} catch (e) {
				console.log(e);
			}
		};
		fetchGasLimit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isButtonDisabled,
		currencyKey,
		strikePrice,
		biddingEndDate,
		maturityDate,
		initialFundingAmount,
		initialLongShorts,
	]);

	const strikePricePlaceholderVal = `${USD_SIGN}10000.00 ${FIAT_CURRENCY_MAP.USD}`;

	const handleClose = () => (onClose ? onClose() : navigateTo(ROUTES.Options.Home));

	const handleApproveManager = async () => {
		const {
			snxJS: { sUSD, BinaryOptionMarketManager },
		} = snxJSConnector as any;
		try {
			setIsManagerApprovalPending(true);
			const maxInt = `0x${'f'.repeat(64)}`;
			const gasEstimate = await sUSD.contract.estimate.approve(
				BinaryOptionMarketManager.contract.address,
				maxInt
			);
			await sUSD.approve(BinaryOptionMarketManager.contract.address, maxInt, {
				gasLimit: normalizeGasLimit(Number(gasEstimate)),
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			});
		} catch (e) {
			console.log(e);
			setIsManagerApprovalPending(false);
		}
	};

	const handleMarketCreation = async () => {
		const {
			snxJS: { BinaryOptionMarketManager },
		} = snxJSConnector as any;
		try {
			const { oracleKey, price, times, bids } = formatCreateMarketArguments();
			await BinaryOptionMarketManager.createMarket(
				oracleKey,
				price,
				withdrawalsEnabled,
				times,
				bids,
				{
					gasPrice: gasInfo.gasPrice * GWEI_UNIT,
					gasLimit,
				}
			);
			setIsCreatingMarket(true);
		} catch (e) {
			console.log(e);
			setIsCreatingMarket(false);
		}
	};

	const formattedBiddingEnd = biddingEndDate ? formatShortDate(biddingEndDate) : EMPTY_VALUE;
	const formattedMaturityDate = maturityDate ? formatShortDate(maturityDate) : EMPTY_VALUE;
	const timeLeftToExercise = maturityDate
		? formatDuration(
				intervalToDuration({ start: maturityDate, end: add(maturityDate, { weeks: 26 }) }),
				{
					format: ['months'],
				}
		  )
		: EMPTY_VALUE;

	return (
		<ThemeProvider theme={lightTheme}>
			<StyledFullScreenModal open={true} onClose={handleClose}>
				<FullScreenModalContainer>
					<BackButtonContainer>
						<BackLinkButton role="button" onClick={handleClose}>
							<ArrowBackIcon />
							{t('options.create-market-modal.back-to-markets')}
						</BackLinkButton>
					</BackButtonContainer>
					<Content>
						<MarketDetails>
							<Title>{t('options.create-market-modal.title')}</Title>
							<Paragraph>{t('options.create-market-modal.subtitle')}</Paragraph>
							<Paragraph>
								<NewToBinaryOptions />
							</Paragraph>
							<Form>
								<FormRow>
									<FormControlGroup>
										<FormControl>
											<FormInputLabel htmlFor="asset">
												{t('options.create-market-modal.details.select-asset-label')}
											</FormInputLabel>
											<SelectContainer>
												<Select
													formatOptionLabel={(option) => (
														<Currency.Name
															currencyKey={option.value}
															name={option.label}
															showIcon={true}
															iconProps={{ type: 'asset' }}
														/>
													)}
													options={assetsOptions}
													placeholder={t('common.eg-val', { val: CRYPTO_CURRENCY_MAP.BTC })}
													value={currencyKey}
													onChange={(option) => {
														setCurrencyKey(option);
													}}
												/>
											</SelectContainer>
										</FormControl>
										<FormControl>
											<FormInputLabel htmlFor="strike-price">
												{t('options.create-market-modal.details.strike-price-label')}
											</FormInputLabel>
											<StyledNumericInput
												id="strike-price"
												value={strikePrice}
												onChange={(e) => setStrikePrice(e.target.value)}
												placeholder={t('common.eg-val', {
													val: strikePricePlaceholderVal,
												})}
											/>
										</FormControl>
									</FormControlGroup>
								</FormRow>
								<FormRow>
									<FormControlGroup>
										<FormControl>
											<FormInputLabel htmlFor="end-of-bidding">
												{t('options.create-market-modal.details.bidding-end-date-label')}
											</FormInputLabel>
											<StyledDatePicker
												id="end-of-bidding"
												dateFormat="MMMM d, yyyy h:mm aa"
												selected={biddingEndDate}
												showTimeSelect={true}
												onChange={(d) => setEndOfBidding(d)}
												minDate={new Date()}
												maxDate={maturityDate}
											/>
										</FormControl>
										<FormControl>
											<FormInputLabel htmlFor="maturity-date">
												{t('options.create-market-modal.details.market-maturity-date-label')}
											</FormInputLabel>
											<StyledDatePicker
												disabled={!biddingEndDate}
												id="maturity-date"
												dateFormat="MMMM d, yyyy h:mm aa"
												selected={maturityDate}
												showTimeSelect={true}
												onChange={(d) => setMaturityDate(d)}
												minDate={biddingEndDate || null}
											/>
										</FormControl>
									</FormControlGroup>
								</FormRow>
								<FormRow>
									<FormControlGroup>
										<FormControl>
											<div style={{ paddingBottom: '4px' }}>
												<FormInputLabel htmlFor="funding-amount" style={{ paddingBottom: '4px' }}>
													{t('options.create-market-modal.details.funding-amount.label')}
												</FormInputLabel>
												<FormInputDesc>
													{t('options.create-market-modal.details.funding-amount.desc')}
												</FormInputDesc>
											</div>
											<StyledNumericInputWithCurrency
												currencyKey={SYNTHS_MAP.sUSD}
												value={initialFundingAmount}
												onChange={(e) => setInitialFundingAmount(e.target.value)}
												inputProps={{
													id: 'funding-amount',
													placeholder: t('common.eg-val', {
														val: `${USD_SIGN}1000.00 ${SYNTHS_MAP.sUSD}`,
													}),
												}}
											/>
										</FormControl>
										<FormControl>
											<FormInputLabel style={{ cursor: 'default' }}>
												{t('options.create-market-modal.details.long-short-skew-label')}
											</FormInputLabel>
											<SliderRow>
												<StyledSlider
													value={initialLongShorts.long}
													onChange={(_, newValue) => {
														const long = newValue as number;
														setInitialLongShorts({
															long,
															short: 100 - long,
														});
													}}
												/>
												<LongsShorts>
													<div>
														<SideIcon side="long" />{' '}
														{t('common.val-in-cents', { val: initialLongShorts.long })}
													</div>
													<div>
														{t('common.val-in-cents', { val: initialLongShorts.short })}{' '}
														<SideIcon side="short" />
													</div>
												</LongsShorts>
											</SliderRow>
										</FormControl>
									</FormControlGroup>
								</FormRow>
							</Form>
						</MarketDetails>
						<MarketSummary>
							<MarketSummaryHeader>
								{t('options.create-market-modal.summary.title')}
							</MarketSummaryHeader>
							<MarketSummaryBody>
								<PreviewAssetAndDateRow>
									<AssetRow>
										{currencyKey ? (
											<>
												<StyledCurrencyName
													showIcon={true}
													currencyKey={(currencyKey as CurrencyKeyOptionType).value}
													name={(currencyKey as CurrencyKeyOptionType).label}
													iconProps={{ type: 'asset' }}
												/>
												<span>&gt;</span>
												<StrikePrice>{`${USD_SIGN}${strikePrice !== '' ? strikePrice : 0} ${
													FIAT_CURRENCY_MAP.USD
												}`}</StrikePrice>
											</>
										) : (
											EMPTY_VALUE
										)}
									</AssetRow>
									<MaturityDateRow>
										{t('common.by-date', { date: formattedMaturityDate })}
									</MaturityDateRow>
								</PreviewAssetAndDateRow>
								<PreviewDatesRow>
									<FlexDivRowCentered>
										<span>{t('options.create-market-modal.summary.dates.bidding-end')}</span>
										<span>{formattedBiddingEnd}</span>
									</FlexDivRowCentered>
									<FlexDivRowCentered>
										<span>{t('options.create-market-modal.summary.dates.maturity-date')}</span>
										<span>{formattedMaturityDate}</span>
									</FlexDivRowCentered>
									<FlexDivRowCentered>
										<span>{t('options.create-market-modal.summary.dates.time-to-exercise')}</span>
										<span>{timeLeftToExercise}</span>
									</FlexDivRowCentered>
								</PreviewDatesRow>
								<PreviewMarketPriceRow>
									<StyledMarketSentiment
										long={initialLongShorts.long / 100}
										short={initialLongShorts.short / 100}
										display="col"
									/>
								</PreviewMarketPriceRow>
								<PreviewFeesRow>
									<FeeSummarySection>
										<FeeHeadingRow>
											<span>{t('options.create-market-modal.summary.fees.bidding')}</span>
											<span>{formatPercentage(marketFees ? marketFees.bidding : 0)}</span>
										</FeeHeadingRow>
										<FeeDetailsRows>
											<FeeDetailsRow>
												<span>{t('options.create-market-modal.summary.fees.creator')}</span>
												<span>{formatPercentage(marketFees ? marketFees.creator : 0)}</span>
											</FeeDetailsRow>
											<FeeDetailsRow>
												<span>{t('options.create-market-modal.summary.fees.pool')}</span>
												<span>{formatPercentage(marketFees ? marketFees.pool : 0)}</span>
											</FeeDetailsRow>
										</FeeDetailsRows>
										<FeeHeadingRow>
											<span>{t('options.create-market-modal.summary.fees.refund')}</span>
											<span>{formatPercentage(marketFees ? marketFees.refund : 0)}</span>
										</FeeHeadingRow>
									</FeeSummarySection>
								</PreviewFeesRow>
							</MarketSummaryBody>
							<MarketSummaryFooter>
								<Withdrawals>
									<FlexDivCentered>
										{t('options.common.withdrawals')}{' '}
										<TooltipIcon
											title={t('options.create-market-modal.summary.withdrawals.tooltip')}
										/>
									</FlexDivCentered>
									<OnOffToggle>
										<Toggle
											isActive={withdrawalsEnabled}
											onClick={() => setWithdrawalsEnabled(true)}
										>
											{t('common.toggle.on')}
										</Toggle>
										<Toggle
											isActive={!withdrawalsEnabled}
											onClick={() => setWithdrawalsEnabled(false)}
										>
											{t('common.toggle.off')}
										</Toggle>
									</OnOffToggle>
								</Withdrawals>
								<NetworkFees gasLimit={gasLimit} />
								{isManagerApproved ? (
									<CreateMarketButton
										palette="primary"
										size="lg"
										disabled={isButtonDisabled || !gasLimit}
										onClick={handleMarketCreation}
									>
										{isCreatingMarket
											? t('options.create-market-modal.summary.creating-market-button-label')
											: t('options.create-market-modal.summary.create-market-button-label')}
									</CreateMarketButton>
								) : (
									<CreateMarketButton palette="primary" size="lg" onClick={handleApproveManager}>
										{isManagerApprovalPending
											? t('options.create-market-modal.summary.waiting-for-approval-button-label')
											: t('options.create-market-modal.summary.approve-manager-button-label')}
									</CreateMarketButton>
								)}
							</MarketSummaryFooter>
						</MarketSummary>
					</Content>
				</FullScreenModalContainer>
			</StyledFullScreenModal>
		</ThemeProvider>
	);
};

const StyledFullScreenModal = styled(FullScreenModal)`
	${media.medium`
		display: block;
		padding: 80px 24px;
	`}
`;

const BackButtonContainer = styled.div`
	text-align: left;
	padding-bottom: 33px;
`;

const BackLinkButton = styled.button`
	${resetButtonCSS};
	${labelSmallCSS};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.buttonDefault};
	> svg {
		margin-right: 8px;
	}
`;

const Title = styled.div`
	${headingH3CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 8px;
`;

const Paragraph = styled.div`
	${bodyCSS};
	color: ${darkTheme.colors.accentL1};
	padding-bottom: 24px;
`;

const Content = styled(GridDivCol)`
	grid-gap: 57px;
	${media.medium`
		grid-auto-flow: row;
	`}
`;

const MarketDetails = styled.div`
	width: 570px;
	text-align: initial;
	${media.medium`
		width: 100%;
	`}
`;

const FormInputLabel = styled.label`
	${formLabelLargeCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	text-align: left;
	cursor: pointer;
`;

const FormInputDesc = styled.div`
	${formDataCSS};
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const Form = styled.div`
	padding-top: 14px;
`;

const FormRow = styled.div`
	padding-bottom: 24px;
`;

const FormControlGroup = styled(GridDivCol)`
	grid-gap: 24px;
	grid-template-columns: 1fr 1fr;
	align-items: baseline;
	${media.medium`
		grid-template-columns: unset;
		grid-auto-flow: row;
	`}
`;

const FormControl = styled(GridDivRow)`
	grid-gap: 8px;
`;

const LongsShorts = styled(FlexDivRowCentered)`
	${formLabelLargeCSS};
	text-transform: none;
`;

const MarketSummary = styled.div`
	width: 379px;
	border-radius: 2px;
	background-color: ${(props) => props.theme.colors.surfaceL2};
	box-shadow: 0px 4px 11px rgba(209, 209, 232, 0.25);
	${media.medium`
		width: 100%;
	`}
`;

const MarketSummaryHeader = styled.div`
	${headingH6CSS};
	text-align: center;
	height: 56px;
	padding: 20px;
	text-transform: uppercase;
`;

const MarketSummaryBody = styled.div`
	padding: 20px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL2};
	border-top: 1px solid ${(props) => props.theme.colors.accentL2};
	> div {
		padding: 12px 0;
		border-bottom: 1px solid ${(props) => props.theme.colors.accentL2};
		&:first-child {
			padding-top: 0;
		}
		&:last-child {
			border-bottom: 0;
			padding-bottom: 0;
		}
	}
`;

const MarketSummaryFooter = styled.div`
	text-align: center;
	padding: 20px;
`;

const PreviewAssetAndDateRow = styled(GridDivRow)`
	justify-content: center;
	grid-gap: 6px;
	padding-bottom: 14px;
`;

const AssetRow = styled.div`
	${headingH5CSS};
	display: inline-grid;
	grid-auto-flow: column;
	align-items: center;
	grid-gap: 9px;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const MaturityDateRow = styled.div`
	${headingH6CSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	text-transform: capitalize;
`;

const StyledCurrencyName = styled(Currency.Name)`
	${headingH5CSS};
	color: ${darkTheme.colors.accentL2};
`;

const StrikePrice = styled.div``;

const PreviewDatesRow = styled.div`
	${formDataCSS};
	display: grid;
	grid-gap: 4px;
	div {
		&:last-child {
			color: ${(props) => props.theme.colors.fontTertiary};
		}
	}
`;
const PreviewMarketPriceRow = styled.div`
	padding-bottom: 18px;
`;
const PreviewFeesRow = styled.div`
	${formDataCSS};
	display: grid;
	padding: 12px 0;
	color: ${(props) => props.theme.colors.fontSecondary};
	grid-gap: 4px;
`;

const FeeSummarySection = styled.div`
	> * {
		margin-bottom: 4px;
		&:last-child {
			margin-bottom: 0;
		}
	}
`;

const FeeHeadingRow = styled(FlexDivRowCentered)``;

const FeeDetailsRow = styled(FlexDivRowCentered)`
	color: ${({ theme }) => theme.colors.fontTertiary};
	> * {
		margin-bottom: 4px;
		&:last-child {
			margin-bottom: 0;
		}
	}
`;

const FeeDetailsRows = styled.div`
	margin-left: 8px;
	border-left: 1px solid ${darkTheme.colors.fontSecondary};
	padding-left: 8px;
`;

const CreateMarketButton = styled(Button)`
	width: 100%;
`;

const StyledDatePicker = styled(DatePicker)`
	.react-datepicker-popper {
		width: max-content;
	}
	.react-datepicker__input-container input {
		height: ${INPUT_SIZES.lg};
	}
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		height: ${INPUT_SIZES.lg};
	}
	.currency-container {
		background-color: ${(props) => props.theme.colors.surfaceL2};
	}
`;

const SliderRow = styled.div`
	padding-top: 32px;
`;

const SelectContainer = styled.div`
	.react-select__control {
		height: ${INPUT_SIZES.lg};
	}
`;

const StyledNumericInput = styled(NumericInput)`
	height: ${INPUT_SIZES.lg};
`;

const StyledMarketSentiment = styled(MarketSentiment)`
	.percent {
		height: 7px;
	}
	.label {
		color: ${(props) => props.theme.colors.fontPrimary};
	}
`;

const Withdrawals = styled(FlexDivRowCentered)`
	color: ${(props) => props.theme.colors.fontTertiary};
	${formDataCSS};
	padding-bottom: 8px;
	text-transform: uppercase;
`;

const OnOffToggle = styled(FlexDivCentered)`
	border-radius: 2px;
	font-size: 10px;
	line-height: normal;
`;

const Toggle = styled.span<{ isActive: boolean }>`
	cursor: pointer;
	width: 28px;
	height: 16px;
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.buttonDefault : props.theme.colors.accentL2};
	color: ${(props) =>
		props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.fontTertiary};
`;

const TooltipIconContainer = styled.span`
	margin-left: 7px;
	cursor: pointer;
	justify-content: center;
	display: inline-flex;
	align-items: center;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: ${(props) => props.theme.colors.accentL2};
	svg {
		width: 4px;
		height: 6px;
	}
`;

export default connector(CreateMarketModal);
