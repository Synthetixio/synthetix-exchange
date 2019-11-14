import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';
import { maxBy } from 'lodash';

// const BLOCK_START = 8242752;

export const competitors = [
	{
		title: 'Srihari',
		tier: 'shrimp',
		address: '0x1456D529AA4B14700acA0aab4B9B819b13bcE08F',
		startingBalance: 0,
		notes: 'Added funds',
	},
	{
		title: 'dingle-berry',
		tier: 'whale',
		startingBalance: 5000,
		address: '0x6595732468A241312bc307F327bA0D64F02b3c20',
		notes: '',
	},
	{
		title: 'Tsarpyth',
		tier: 'whale',
		startingBalance: 0,
		address: '0xa4F6E75def3AeD3627458CA29690DB7a80A04c84',
		notes: 'No synths',
	},
	{
		title: 'David',
		tier: 'shrimp',
		startingBalance: 200,
		address: '0x12A815D5209622066918CC146f54CD54FA998091',
		notes: '',
	},
	{
		title: 'ladidadi',
		tier: 'whale',
		startingBalance: 5680.26,
		address: '0x274cB85e75928CB9a3Ec8cdbdfc57cc786cF8bB9',
		notes: '',
	},
	{
		title: 'neuros',
		tier: 'shrimp',
		startingBalance: 100,
		address: '0x92C0c5F97959fdF79927c1619c1761B7648f9bD1',
		notes: '',
	},
	{
		title: 'Yoyo',
		tier: 'whale',
		startingBalance: 5000,
		address: '0x9Fa6F3c26d31CC488e7A83D84707EEf9FEbf8C13',
		notes: '',
	},
	{
		title: 'deltatiger1000',
		tier: 'dolphin',
		startingBalance: 1000,
		address: '0x28d6037EDEAf8ec2c91c9b2cF9A1643111d8F198',
		notes: '',
	},
	{
		title: 'deltatiger100',
		tier: 'shrimp',
		startingBalance: 134,
		address: '0xc0d6E904ADf6A55511B67907B0917D769F38c5Dd',
		notes: '',
	},
	{
		title: 'Rorschach',
		tier: 'dolphin',
		startingBalance: 1000,
		address: '0xB0F10cBf4Ae7028a456D90d03Ed33368F8c0f46f',
		notes: '',
	},
	{
		title: 'Nairobi',
		tier: 'dolphin',
		startingBalance: 1000,
		address: '0x6aF3c188CcAc6Bd4EF96aBb06D0C40e6BdCd29ac',
		notes: '',
	},
	{
		title: 'ThinkingETH',
		tier: 'whale',
		startingBalance: 5000,
		address: '0xa1cCC796E2B44e80112c065A4d8F05661E685eD8',
		notes: '',
	},
	{
		title: '1053r',
		tier: 'dolphin',
		startingBalance: 0,
		address: '0x542a0eaf1358480ec0703f07bc3120a6503ebbc1',
		notes: 'No sUSD',
	},
	{
		title: 'shrimpalooza',
		tier: 'shrimp',
		startingBalance: 147.72,
		address: '0xCFe39E324aDF35C4B2Fe138738B107d6831b9480',
		notes: '',
	},
	{
		title: 'TootsieRoll',
		tier: 'dolphin',
		startingBalance: 1464.12,
		address: '0x973B1E385659E317Dd43B49C29E45e66c0275696',
		notes: '',
	},
	{
		title: 'Danijel',
		tier: 'dolphin',
		startingBalance: 1358.54,
		address: '0x461783A831E6dB52D68Ba2f3194F6fd1E0087E04',
		notes: '',
	},
	{
		title: 'Kain',
		tier: 'whale',
		startingBalance: 10000,
		address: '0x59084EeB94a1e9535877a16D7Ce71ed11b8792Df',
		notes: '',
	},
	{
		title: 'G0ld3nH3ntaiGUY',
		tier: 'whale',
		startingBalance: 5000,
		address: '0xeB8c32865fe19DBbB72e8434e480448941f8F010',
		notes: '',
	},
	{
		title: 'chumplovesucker',
		tier: 'dolphin',
		startingBalance: 1000,
		address: '0xd921BE0A77E0204874C09be7894Ff1b2E83D2dCc',
		notes: '',
	},
];

let synths;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getCompetitorsData() {
	const { synthetixJs, initialized } = synthetixJsTools;
	if (!initialized) return;

	synths = synthetixJs.contractSettings.synths.filter(({ asset }) => asset);

	// get starting balance
	// await Promise.all(competitors.map(competitor => {
	//   return getWalletBalance(competitor.address, BLOCK_START)
	//     .then(balance => {
	//       competitor.startingBalance = balance || '0'
	//     })
	// }))

	//get current balance
	await Promise.all(
		competitors.map(competitor => {
			if (competitor.notes) return competitor;
			return getWalletBalance(competitor.address).then(balance => {
				(competitor.balance = balance.total || '0'),
					(competitor.primarySynth = balance.primarySynth);
			});
		})
	);

	console.log(competitors);
	competitors.forEach(c => {
		const startingBalance = parseFloat(c.startingBalance);
		const balance = parseFloat(c.balance);

		c.gain = startingBalance > 0 ? (balance - startingBalance) / startingBalance : 0;
		c.eligible = c.notes ? `No (${c.notes})` : 'Yes';
	});

	return competitors;
}

async function getWalletBalance(wallet, blockNbr) {
	const { synthetixJs, getUtf8Bytes } = synthetixJsTools;

	let atBlock = {};
	if (blockNbr) {
		atBlock.blockTag = blockNbr;
	}

	let balances;
	try {
		balances = await Promise.all(
			synths.map(synth => {
				return synthetixJs[synth.name].balanceOf(wallet, atBlock);
			})
		);
	} catch (e) {
		await sleep(500);
		balances = await Promise.all(
			synths.map(synth => {
				return synthetixJs[synth.name].balanceOf(wallet, atBlock);
			})
		);
	}

	let totalBalance;
	try {
		totalBalance = await Promise.all(
			balances.map((balance, i) => {
				return synthetixJs.Synthetix.effectiveValue(
					getUtf8Bytes(synths[i].name),
					balance,
					getUtf8Bytes('sUSD'),
					atBlock
				).then(balance => ({
					key: synths[i].name,
					value: balance,
				}));
			})
		);
	} catch (e) {
		await sleep(500);
		totalBalance = await Promise.all(
			balances.map((balance, i) => {
				return synthetixJs.Synthetix.effectiveValue(
					getUtf8Bytes(synths[i].name),
					balance,
					getUtf8Bytes('sUSD'),
					atBlock
				).then(balance => ({
					key: synths[i].name,
					value: balance,
				}));
			})
		);
	}

	const primarySynth = maxBy(totalBalance, elem =>
		parseFloat(synthetixJsTools.utils.formatEther(elem.value))
	);

	return {
		total: formatBigNumber(
			totalBalance.map(t => t.value).reduce((pre, curr) => pre.add(curr)),
			2
		),
		primarySynth: primarySynth.key,
	};
}
