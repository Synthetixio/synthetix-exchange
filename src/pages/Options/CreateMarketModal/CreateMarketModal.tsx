import React, { useState, FC, useMemo, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import orderBy from 'lodash/orderBy';

import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';

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
import { headingH3CSS, headingH6CSS, headingH5CSS } from 'components/Typography/Heading';
import { bodyCSS, sectionTitleCSS } from 'components/Typography/General';
import NumericInput from 'components/Input/NumericInput';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { formLabelLargeCSS, formDataCSS, formLabelSmallCSS } from 'components/Typography/Form';
import Select from 'components/Select';
import Currency from 'components/Currency';
import Button from 'components/Button/Button';

import {
	GridDivCol,
	GridDivRow,
	FlexDivRowCentered,
	FullScreenModalCloseButton,
	FullScreenModal,
	FullScreenModalContainer,
} from 'shared/commonStyles';
import { media } from 'shared/media';

import {
	formatPercentage,
	formatShortDate,
	formattedDuration,
	bytesFormatter,
} from 'utils/formatters';
import MarketSentiment from '../components/MarketSentiment';
import NetworkFees from '../components/NetworkFees';

// const MATURITY_DATE_DAY_DELAY = 1;

const StyledSlider = withStyles({
	root: {
		color: colors.green,
		height: 16,
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

type CreateMarketModalProps = PropsFromRedux;

type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

type MarketFees = Record<string, number>;

export const CreateMarketModal: FC<CreateMarketModalProps> = ({
	synths,
	currentWallet,
	gasInfo,
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

	const handleClose = () => navigateTo(ROUTES.Options.Home);

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
			await BinaryOptionMarketManager.createMarket(oracleKey, price, times, bids, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit,
			});
			setIsCreatingMarket(true);
		} catch (e) {
			console.log(e);
			setIsCreatingMarket(false);
		}
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<StyledFullScreenModal open={true} onClose={handleClose}>
				<FullScreenModalContainer>
					<FullScreenModalCloseButton onClick={handleClose}>
						<CloseCrossIcon />
					</FullScreenModalCloseButton>
					<Title>{t('options.create-market-modal.title')}</Title>
					<Subtitle>{t('options.create-market-modal.subtitle')}</Subtitle>
					<Content>
						<MarketDetails>
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
								<FormControl>
									<FlexDivRowCentered>
										<FormInputLabel style={{ cursor: 'default' }}>
											{t('options.create-market-modal.details.long-short-skew-label')}
										</FormInputLabel>
										<div>
											<Longs>{t('common.val-in-cents', { val: initialLongShorts.long })}</Longs>
											{' / '}
											<Shorts>{t('common.val-in-cents', { val: initialLongShorts.short })}</Shorts>
										</div>
									</FlexDivRowCentered>
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
								</FormControl>
							</FormRow>
							<FormRow>
								<FormControl>
									<FormInputLabel htmlFor="funding-amount">
										{t('options.create-market-modal.details.funding-amount-label')}
									</FormInputLabel>
									<StyledNumericInputWithCurrency
										currencyKey={SYNTHS_MAP.sUSD}
										value={initialFundingAmount}
										onChange={(e) => setInitialFundingAmount(e.target.value)}
										inputProps={{
											id: 'funding-amount',
										}}
									/>
								</FormControl>
							</FormRow>
						</MarketDetails>
						<MarketSummary>
							<MarketSummaryTitle>
								{t('options.create-market-modal.summary.title')}
							</MarketSummaryTitle>
							<MarketSummaryPreview>
								<PreviewAssetRow>
									{currencyKey ? (
										<StyledCurrencyName
											showIcon={true}
											currencyKey={(currencyKey as CurrencyKeyOptionType).value}
											name={(currencyKey as CurrencyKeyOptionType).label}
											iconProps={{ type: 'asset' }}
										/>
									) : (
										EMPTY_VALUE
									)}
									<span>&gt;</span>
									<StrikePrice>{`${USD_SIGN}${strikePrice !== '' ? strikePrice : 0} ${
										FIAT_CURRENCY_MAP.USD
									}`}</StrikePrice>
								</PreviewAssetRow>
								<PreviewDatesRow>
									<div>
										{t('options.create-market-modal.summary.dates.bids-end', {
											date: biddingEndDate ? formatShortDate(biddingEndDate) : EMPTY_VALUE,
										})}
									</div>
									<div>
										{t('options.create-market-modal.summary.dates.trading-period', {
											period: biddingEndDate
												? formattedDuration(
														intervalToDuration({ start: Date.now(), end: biddingEndDate })
												  )
												: EMPTY_VALUE,
										})}
									</div>
								</PreviewDatesRow>
								<PreviewMarketPriceRow>
									<MarketSentiment
										long={initialLongShorts.long / 100}
										short={initialLongShorts.short / 100}
									/>
								</PreviewMarketPriceRow>
								<PreviewFeesRow>
									<FeeSummarySection>
										<FeeHeadingRow>
											<span>{t('options.create-market-modal.summary.fees.bidding')}</span>
											<span>{formatPercentage(marketFees ? marketFees.bidding : 0)}</span>
										</FeeHeadingRow>
										<FeeDetailsRow>
											<FeeLabel>{t('options.create-market-modal.summary.fees.creator')}</FeeLabel>
											<span>{formatPercentage(marketFees ? marketFees.creator : 0)}</span>
										</FeeDetailsRow>
										<FeeDetailsRow>
											<FeeLabel>{t('options.create-market-modal.summary.fees.pool')}</FeeLabel>
											<span>{formatPercentage(marketFees ? marketFees.pool : 0)}</span>
										</FeeDetailsRow>
									</FeeSummarySection>
									<FlexDivRowCentered>
										<span>{t('options.create-market-modal.summary.fees.refund')}</span>
										<span>{formatPercentage(marketFees ? marketFees.refund : 0)}</span>
									</FlexDivRowCentered>
								</PreviewFeesRow>
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
							</MarketSummaryPreview>
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

const Title = styled.div`
	${headingH3CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 8px;
`;

const Subtitle = styled.div`
	${bodyCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	padding-bottom: 57px;
	max-width: 520px;
	margin: 0 auto;
`;

const Content = styled(GridDivCol)`
	grid-gap: 57px;
	${media.medium`
		grid-auto-flow: row;
	`}
`;

const MarketDetails = styled.div`
	width: 570px;
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

const FormRow = styled.div`
	padding-bottom: 24px;
`;

const FormControlGroup = styled(GridDivCol)`
	grid-gap: 24px;
	grid-template-columns: 1fr 1fr;
	${media.medium`
		grid-template-columns: unset;
		grid-auto-flow: row;
	`}
`;

const FormControl = styled(GridDivRow)`
	grid-gap: 8px;
`;

const Longs = styled.span`
	${headingH6CSS};
	color: ${(props) => props.theme.colors.green};
`;
const Shorts = styled.span`
	${headingH6CSS};
	color: ${(props) => props.theme.colors.red};
`;

const MarketSummary = styled.div`
	width: 330px;
	background-color: ${(props) => props.theme.colors.surfaceL2};
	${media.medium`
		width: 100%;
	`}
`;

const MarketSummaryTitle = styled.div`
	${sectionTitleCSS};
	text-align: center;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	height: 48px;
	color: ${(props) => props.theme.colors.fontPrimary};
	padding: 15px;
	text-transform: uppercase;
`;

const MarketSummaryPreview = styled.div`
	padding: 20px;
`;
const PreviewAssetRow = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	align-items: center;
	grid-gap: 9px;
	${headingH5CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 14px;
`;

const StyledCurrencyName = styled(Currency.Name)`
	${headingH5CSS};
	color: ${darkTheme.colors.accentL1};
`;

const StrikePrice = styled.div``;

const PreviewDatesRow = styled.div`
	${formLabelSmallCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	padding-bottom: 11px;
	display: grid;
	grid-gap: 4px;
	text-transform: none;
`;
const PreviewMarketPriceRow = styled.div`
	padding-bottom: 18px;
`;
const PreviewFeesRow = styled.div`
	${formDataCSS};
	display: grid;
	padding: 12px 0;
	border-top: 1px solid ${(props) => props.theme.colors.surfaceL1};
	border-bottom: 1px solid ${(props) => props.theme.colors.surfaceL1};
	color: ${(props) => props.theme.colors.fontSecondary};
	margin-bottom: 18px;
	grid-gap: 4px;
`;

const FeeSummarySection = styled.div`
	margin-bottom: 6px;
`;

const FeeHeadingRow = styled(FlexDivRowCentered)`
	margin-bottom: 4px;
`;

const FeeDetailsRow = styled(FlexDivRowCentered)`
	color: ${({ theme }) => theme.colors.fontTertiary};
`;

const FeeLabel = styled.span`
	margin-left: 12px;
`;

const CreateMarketButton = styled(Button)`
	width: 100%;
`;

const StyledDatePicker = styled(DatePicker)`
	.react-datepicker-popper {
		width: max-content;
	}
	.react-datepicker__input-container input {
		border-color: transparent;
	}
`;

const StyledNumericInput = styled(NumericInput)`
	border-color: transparent;
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		border-top-color: transparent;
		border-bottom-color: transparent;
		border-right-color: transparent;
		border-left-color: ${(props) => props.theme.colors.accentL1};
	}

	.currency-container {
		border-color: transparent;
	}
`;

const SelectContainer = styled.div`
	.react-select__control {
		border-color: transparent;
		&:hover {
			border-color: transparent;
		}
	}
`;

export default connector(CreateMarketModal);
