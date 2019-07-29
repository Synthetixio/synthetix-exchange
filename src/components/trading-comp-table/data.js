import synthetixJsTools from '../../synthetixJsTool'
import { formatBigNumber } from '../../utils/converterUtils';

const BLOCK_START = 8242752;

export const competitors = [
  { address: '0x4E60bE84870FE6AE350B563A121042396Abe1eaF', comp: 'perc', title: 'DegenSpartan'},
  // { address: '0x2e0dAdd0174BB9F4099b3E04e4a2300de2893B0B', comp: 'perc'},
  // { address: '0x90f9F22DD034da42dEfcB6866B854ecb45Ed6d16', comp: 'abs', title: 'Arthur'},
  // { address: '0xf60C9808a0205535C6A211f2732c730157F163fc', comp: 'abs', title: 'KB2'},
  // { address: '0x31b40778AE19220775184E24066899C34B7f0cbE', comp: 'perc'},
  // { address: '0x679FcCB55Df178679feEFE173cf20e09294A50c2', comp: 'perc', title: 'xastor'},
  // { address: '0x68575571E75D2CfA4222e0F8E7053F056EB91d6C', comp: 'perc'},
  // { address: '0x214F7b85a0f0aa067BCC2Ea6263dD4b0Ede8957C', comp: 'perc', title: 'Swampmasher'},
  // { address: '0xC2B82E7Db33D926eBfc1d92F45a9b234e531B67B', comp: 'perc', title: 'defending r1 champion'},
  // { address: '0xEe685180aCb7Dd68A6718444B42af9faC99FCcef', comp: 'perc', title: 'kingpower'},
  // { address: '0x3E55C1C091E3a15CdA8B0526438659974bff9Fcd', comp: 'perc', title: 'Mr Robot'},
  // { address: '0x9fa6f3c26d31cc488e7a83d84707eef9febf8c13', comp: 'abs', title: 'Amantay'},
  // { address: '0x31A739B795586810581ACC16FCF9cdA3E7e32813', comp: 'perc', title: 'degengambler'},
  // { address: '0x6aF3c188CcAc6Bd4EF96aBb06D0C40e6BdCd29ac', comp: 'perc', title: 'onepunchman'},
  // { address: '0x0b2D13C79761aB6e44537BB88041910507d15B09', comp: 'perc'},
  // { address: '0xe92c9Ed9e227364De07AC4f0A2F929a0374d6F9D', comp: 'perc', title: 'iki-jima'},
  // { address: '0x28d6037EDEAf8ec2c91c9b2cF9A1643111d8F198', comp: 'abs', title: 'deltatiger'},
  // { address: '0xc0d6E904ADf6A55511B67907B0917D769F38c5Dd', comp: 'perc'},
  // { address: '0x59084EeB94a1e9535877a16D7Ce71ed11b8792Df', comp: 'perc', title: 'Kain'},
  // { address: '0x706Dda09ED3Df695200FC65eDdC41bB20baBE97E', comp: 'perc', title: 'Crypto Pharaoh'},
  // { address: '0x87006CAc050F4774Ed5415985D624748DEbe4D24', comp: 'abs', title: 'Brendan(tradeking)'},
  // { address: '0x12Cd4302eb0911220f9F36e0Ba4f467117f55790', comp: 'perc', title: 'lucky'},
  // { address: '0xb196b5785f19A0F4de6F91547b656b986119769d', comp: 'perc', title: 'lv'},
  // { address: '0x12A815D5209622066918CC146f54CD54FA998091', comp: 'perc'},
  // { address: '0xb28f5f6b0fe455816ade9e73d7f531050601081e', comp: 'perc', title: 'Daryl'},
  // { address: '0x274cB85e75928CB9a3Ec8cdbdfc57cc786cF8bB9', comp: 'perc'},
  // { address: '0x6601C7EE44356C88fFE9a39bD01497d1E09Ec1a3', comp: 'perc', title: 'krudus'},
  // { address: '0xd9ba84b9acdaa7ab4450004dfb98eee4f8a250e5', comp: 'perc', title: 'Tarantulo'},
  // { address: '0x12AA1d8F4033158B75cac1c7709ECf071Acc6bcb', comp: 'perc'},
  // { address: '0x2E63E1C7FdF4a69eDBD0a6045180D02faF241D4f', comp: 'perc', title: 'AMCPA'},
  // { address: '0x16ba56fbcf2017e52f40eced464fff1bd31b8b93', comp: 'perc'},
  // { address: '0x1456D529AA4B14700acA0aab4B9B819b13bcE08F', comp: 'perc', title: 'Srihari'},
  // { address: '0x9ff7aCEd7670213499e74b784DB19084dC8DDb3A', comp: 'perc', title: 'farnode'},
  // { address: '0x3e72E7597A09Bad2A9d0c66d8Ea91513E2445e62', comp: 'perc', title: 'A small shrubbery'},
  // { address: '0x347397EefF516c7F3809A4c1dadE10D692341d0f', comp: 'perc'},
  // { address: '0x47067061cc6092454fdc3a43b44f653dcb662de2', comp: 'perc', title: 'Xai'},
  // { address: '0xCD37Cd2dB1A6b553a58cc5791ee97103dA33dB6F', comp: 'perc', title: 'Paradox'},
  // { address: '0x8b85F2ED950c15a1470bD6706f2ce3469E028089', comp: 'perc'},
  // { address: '0x5Dc67417792fB09192Dc9caa1ffE3c7D7c1C1099', comp: 'perc'},
  // { address: '0x971816919ff761A4B57b6C34C35662C250979a0A', comp: 'perc'},
  // { address: '0xaD92E09975a6C640016632Ef1CB5e97Dc44c244c', comp: 'perc'},
  // { address: '0xd369f4e041bd500bdbb5fb09953907033a2c9e20', comp: 'abs'},
  // { address: '0x6595732468A241312bc307F327bA0D64F02b3c20', comp: 'perc'},
  // { address: '0x0FeF2F14127A2a290256523905e39DC817c11E42', comp: 'perc', title: 'Warren Buffet'},
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
  await Promise.all(competitors.map(competitor => {
    return getWalletBalance(competitor.address, BLOCK_START)
      .then(balance => {
        competitor.startingBalance = balance || '0'
      })
  }))

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
    c.eligible = true
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