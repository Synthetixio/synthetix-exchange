import synthetixJsTools from '../synthetixJsTool';

export const formatBigNumber = (amount, decimals, commify) => {
	if (!amount) return;
	commify = !!commify;
	const amountString = synthetixJsTools.utils.formatEther(amount, { commify });

	if (typeof decimals === 'undefined') {
		return amountString;
	} else {
		const [first, remainder] = amountString.split('.');
		let joined = `${first}.${remainder.substring(0, decimals)}`;

		if (joined.endsWith('.')) return joined.substring(0, joined.length - 1);

		return joined;
	}
};
