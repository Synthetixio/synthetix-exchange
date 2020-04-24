export const synthWeight = {
	BTC: 1,
	ETH: 2,
	XRP: 3,
	LTC: 4,
	BNB: 5,
	XTZ: 6,
	TRX: 7,
	LINK: 8,
	MKR: 9,
};

// Ugly. Needs to find a better solution.
export const pairWeight = synth => {
	if (synth.category === 'forex') return 1;
	if (synth.name === 'sBTC') return 2;
	if (synth.name === 'sETH') return 3;
	if (synth.category === 'commodity') return 4;
	if (synth.name === 'sXRP') return 5;
	if (synth.name === 'sLTC') return 6;
	if (synth.name === 'sBNB') return 7;
	if (synth.name === 'sXTZ') return 8;
	if (synth.name === 'sTRX') return 9;
	if (synth.name === 'sLINK') return 10;
	if (synth.name === 'sMKR') return 11;
	if (synth.name === 'iBTC') return 12;
	if (synth.name === 'iETH') return 13;
	if (synth.name === 'iXRP') return 14;
	if (synth.name === 'iLTC') return 15;
	if (synth.name === 'iBNB') return 16;
	if (synth.name === 'iXTZ') return 17;
	if (synth.name === 'iTRX') return 18;
	if (synth.name === 'iLINK') return 19;
	if (synth.name === 'iMKR') return 20;
	if (synth.category === 'index') return 21;
	return 22;
};
