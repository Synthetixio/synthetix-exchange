import synthetixJsTools from '../../synthetixJsTool'
import { formatBigNumber } from '../../utils/converterUtils';

// const BLOCK_START = 8242752;

export const competitors =
 [
  {
    'title': 'Srihari',
    'tier': 'shrimp',
    'address': '0x1456D529AA4B14700acA0aab4B9B819b13bcE08F',
    'startingBalance': 0,
    'notes': 'Added funds',
  },
  {
    'title': 'dingle-berry',
    'tier': 'whale',
    'startingBalance': 5000,
    'address': '0x6595732468A241312bc307F327bA0D64F02b3c20',
    'notes': '',
  },
  {
    'title': 'Tsarpyth',
    'tier': 'whale',
    'startingBalance': 0,
    'address': '0xa4F6E75def3AeD3627458CA29690DB7a80A04c84',
    'notes': 'No synths',
  },
  {
    'title': 'David',
    'tier': 'shrimp',
    'startingBalance': 200,
    'address': '0x12A815D5209622066918CC146f54CD54FA998091',
    'notes': '',
  },
  {
    'title': 'ladidadi',
    'tier': 'whale',
    'startingBalance': 5680.26,
    'address': '0x274cB85e75928CB9a3Ec8cdbdfc57cc786cF8bB9',
    'notes': '',
  },
  {
    'title': 'neuros',
    'tier': 'shrimp',
    'startingBalance': 100,
    'address': '0x92C0c5F97959fdF79927c1619c1761B7648f9bD1',
    'notes': '',
  },
  {
    'title': 'Yoyo',
    'tier': 'whale',
    'startingBalance': 5000,
    'address': '0x9Fa6F3c26d31CC488e7A83D84707EEf9FEbf8C13',
    'notes': '',
  },
  {
    'title': 'deltatiger1000',
    'tier': 'dolphin',
    'startingBalance': 1000,
    'address': '0x28d6037EDEAf8ec2c91c9b2cF9A1643111d8F198',
    'notes': '',
  },
  {
    'title': 'deltatiger100',
    'tier': 'shrimp',
    'startingBalance': 134,
    'address': '0xc0d6E904ADf6A55511B67907B0917D769F38c5Dd',
    'notes': '',
  },
  {
    'title': 'Rorschach',
    'tier': 'dolphin',
    'startingBalance': 1000,
    'address': '0xB0F10cBf4Ae7028a456D90d03Ed33368F8c0f46f',
    'notes': '',
  },
  {
    'title': 'Nairobi',
    'tier': 'dolphin',
    'startingBalance': 1000,
    'address': '0x6aF3c188CcAc6Bd4EF96aBb06D0C40e6BdCd29ac',
    'notes': '',
  },
  {
    'title': 'ThinkingETH',
    'tier': 'whale',
    'startingBalance': 5000,
    'address': '0xa1cCC796E2B44e80112c065A4d8F05661E685eD8',
    'notes': '',
  },
];

let synths;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getCompetitorsData() {
  const { synthetixJs, initialized } = synthetixJsTools;
  if (!initialized)
    return;

  synths = synthetixJs.contractSettings.synths.filter(({ asset }) => asset);

  // get starting balance
  // await Promise.all(competitors.map(competitor => {
  //   return getWalletBalance(competitor.address, BLOCK_START)
  //     .then(balance => {
  //       competitor.startingBalance = balance || '0'
  //     })
  // }))

  //get current balance
  await Promise.all(competitors.map(competitor => {
    return getWalletBalance(competitor.address)
      .then(balance => {
        competitor.balance = balance || '0'
      })
  })) 

  console.log(competitors)
  competitors.forEach(c => {
    const startingBalance = parseFloat(c.startingBalance)
    const balance = parseFloat(c.balance)

    c.gain = startingBalance > 0 ? (balance - startingBalance) / startingBalance : 0
    c.eligible = c.notes ? `No (${c.notes})` : 'Yes';
  })

  return competitors
}

async function getWalletBalance(wallet, blockNbr) {
  console.log('GET Wallet balance of', wallet)
  const { synthetixJs, utils } = synthetixJsTools;

  let atBlock = {}
  if (blockNbr) {
    atBlock.blockTag = blockNbr
  }

  let balances;
  try {
    balances = await Promise.all(
      synths.map(synth => {
        return synthetixJs[synth.name].balanceOf(wallet, atBlock);
      })
    );
  } catch (e) {
    await sleep(500)
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
          utils.toUtf8Bytes4(synths[i].name),
          balance,
          utils.toUtf8Bytes4('sUSD'),
          atBlock
        );
      })
    );
  } catch (e) {
    await sleep(500);
    totalBalance = await Promise.all(
      balances.map((balance, i) => {
        return synthetixJs.Synthetix.effectiveValue(
          utils.toUtf8Bytes4(synths[i].name),
          balance,
          utils.toUtf8Bytes4('sUSD'),
          atBlock
        );
      })
    );
  }


  return formatBigNumber(
    totalBalance.reduce((pre, curr) => pre.add(curr)),
    2
   )
}

// const loadingGIF = '<img src="https://media.giphy.com/media/TvLuZ00OIADoQ/giphy.gif" width=150 />';
// const tbodyTarget = document.querySelector('tbody');
// const ulTarget = document.querySelector('ul');
// ulTarget.querySelector('#addressCount var').innerHTML = competitors.length;
// ulTarget.querySelector('#synthCount var').innerHTML = synths.length;
// const pcentGainLeaderTarget = document.querySelector('#pcentGainLeaders ol');
// const absGainLeaderTarget = document.querySelector('#absGainLeaders ol');
// 
// const startingBlock = 7896450;
// const esLink = ({ block, address, label }) => 
//  `<a target="_blank" href="https://etherscan.io/${block ? 'block' : 'address'}/${block || address}">${label || block || address}</a>`
// 
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// 
// let running = false;
// 
// const lookup = async () => {
// 	
// 	const results = [];
// 	let synthDistribution = synths.map(({ name }) => { return { name, balance: 0 }; });
// 	let totalUSDBalance = 0;
// 	
// 	const addressSynthBalanceAt = async ({ address, blockNbr }) => {
// 		const atBlock = { blockTag: blockNbr };
// 		const sUSD = toUtf8Bytes('sUSD');
// 
// 		let balances = [];
// 		try {
// 			balances = await Promise.all(synths.map(({ name }) => snxjs[name].contract.balanceOf(address, atBlock)));	
// 		} catch (err) {
// 			sleep(500);
// 			balances = await Promise.all(synths.map(({ name }) => snxjs[name].contract.balanceOf(address, atBlock)));	
// 		}
// 
// 		let balancesInUSD = [];
// 		try {
// 			balancesInUSD = await Promise.all(balances.map((balanceOf, i) => snxjs.Synthetix.contract.effectiveValue(toUtf8Bytes(synths[i].name), balanceOf.toString(), sUSD, atBlock)));
// 		} catch (err) {
// 			sleep(500);
// 			balancesInUSD = await Promise.all(balances.map((balanceOf, i) => snxjs.Synthetix.contract.effectiveValue(toUtf8Bytes(synths[i].name), balanceOf.toString(), sUSD, atBlock)));
// 		}
// 
// 		synthDistribution = synthDistribution.map(({ name, balance }, i) => { return { name, balance: (balance + Number(formatEther(balancesInUSD[i]))) }; });
// 		return balancesInUSD.map(balance => formatEther(balance)).reduce((memo, cur) => memo + Number(cur), 0);
// 	};
// 
// 	running = true;
// 	tbodyTarget.innerHTML = `<tr><td colspan="100">${loadingGIF}</td></tr>`;
// 	pcentGainLeaderTarget.innerHTML = '...';
// 	absGainLeaderTarget.innerHTML = '...';
// 
// 	const updateLeaderboard = ({ target, prop, pending }) => {
// 		const leaders = results.sort((a, b) => a[prop] > b[prop] ? -1 : 1).slice(0, 3);
// 		target.innerHTML = 
// 			leaders.map(({ address, truncatedAddress, [prop]: gain }) => `
// 				<li class="${pending ? 'helper-text' : 'success-text'}">
// 					${pending ? 'Pending... ' : ''} ${esLink({ address, label: truncatedAddress })} - ${numbro(gain).format('0.00')}
// 				</li>
// 			`).join('');
// 	}
// 	
//   try {
// 		    	
//     const usdToSnxPrice = snxjs.utils.formatEther(await snxjs.Depot.usdToSnxPrice());
//     const currentBlockNumber = 7985931;
// 		ulTarget.querySelector('#snxPrice var').innerHTML = `$${numbro(usdToSnxPrice).format('0.00000')}`;
// 		ulTarget.querySelector('#curBlock var').innerHTML = `${esLink({ block: startingBlock })} to ${esLink({ block: currentBlockNumber })}`;
// 		
// 		// now for all addresses
// 		tbodyTarget.querySelector('td').innerHTML = '';
// 		for (const { address, comp, title } of competitors) {
// 			if (!running) {
// 				// allow user to stop these processes easily
// 				tbodyTarget.innerHTML += `<tr><td colspan="100" class="helper-text">Cancelled.</td></tr>`
// 				break; 
// 			}
// 			const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
// 			const startingBalanceInUSD = await addressSynthBalanceAt({ address, blockNbr: startingBlock });
// 			const closingBalanceInUSD = await addressSynthBalanceAt({ address, blockNbr: currentBlockNumber });
// 			totalUSDBalance += closingBalanceInUSD;
// 			const absGain = closingBalanceInUSD - startingBalanceInUSD;
// 			const pcentGain = startingBalanceInUSD > 0 ? ((closingBalanceInUSD - startingBalanceInUSD) / (startingBalanceInUSD || 1) * 100) : 0;
// 			
// 			tbodyTarget.innerHTML += `<tr>
// 				<td>${esLink({ address, label: truncatedAddress })}</td>
// 				<td>${title || ''}</td>
// 				<td>${comp}</td>
// 				<td>${numbro(startingBalanceInUSD).format('$0,0.00')}</td>
// 				${startingBalanceInUSD > 0 ? (`
// 					<td>${numbro(closingBalanceInUSD).format('$0,0.00')}</td>
// 					<td>${numbro(absGain).format('$0,0.00')}</td>
// 					<td>${numbro(pcentGain).format('0.00')}%</td>`
// 				) : (`
// 					<td colspan="3" class="error-text">Disqualified (no starting balance)</td>`
// 				)}
// 				</tr>`;
// 			
// 			if (startingBalanceInUSD > 0) {
// 				results.push({ pcentGain: comp === 'perc' ? pcentGain : 0, absGain: comp === 'abs' ? absGain : 0, address, truncatedAddress });
// 
// 				updateLeaderboard({ target: pcentGainLeaderTarget, prop: 'pcentGain', pending: true });
// 				updateLeaderboard({ target: absGainLeaderTarget, prop: 'absGain', pending: true });
// 			}		
// 			
// 		}
// 		
// 		updateLeaderboard({ target: pcentGainLeaderTarget, prop: 'pcentGain' });
// 		updateLeaderboard({ target: absGainLeaderTarget, prop: 'absGain' });
// 		
//   } catch (err) {
//     console.error(err);
//   }
// 	
// 	new frappe.Chart('#synthChart', {  
// 		title: "Competitors' Synth Distribution (total USD values compared)", 
//     data: {
//       labels: synthDistribution.filter(({ balance }) => balance > 0).map(({ name }) => name),
//       datasets: [
//           {
//               values: synthDistribution.filter(({ balance }) => balance > 0).map(({ balance }) => Number((balance).toFixed(2)))
//           }
//       ]
//     },
//     type: 'percentage'
//   });
// };
// 
// document.querySelector('button#cancel').addEventListener('click', () => running = false);
// document.querySelector('button#run').addEventListener('click', lookup);