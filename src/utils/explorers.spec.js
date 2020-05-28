import { getEtherscanTxLink, getEtherscanAddressLink, getEtherscanTokenLink } from './explorers';

describe('Explorers', () => {
	describe('Etherscan', () => {
		const txId = '0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d';
		const address = '0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4';

		it('returns the correct etherscan links for MAINNET', () => {
			const networkId = '1';

			expect(getEtherscanTxLink(networkId, txId)).toEqual(
				'https://etherscan.io/tx/0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d'
			);
			expect(getEtherscanAddressLink(networkId, address)).toEqual(
				'https://etherscan.io/address/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
			expect(getEtherscanTokenLink(networkId, address)).toEqual(
				'https://etherscan.io/token/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
		});

		it('returns the correct etherscan links for ROPSTEN', () => {
			const networkId = '3';

			expect(getEtherscanTxLink(networkId, txId)).toEqual(
				'https://ropsten.etherscan.io/tx/0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d'
			);
			expect(getEtherscanAddressLink(networkId, address)).toEqual(
				'https://ropsten.etherscan.io/address/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
			expect(getEtherscanTokenLink(networkId, address)).toEqual(
				'https://ropsten.etherscan.io/token/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
		});

		it('returns the correct etherscan links for RINKEBY', () => {
			const networkId = '4';

			expect(getEtherscanTxLink(networkId, txId)).toEqual(
				'https://rinkeby.etherscan.io/tx/0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d'
			);
			expect(getEtherscanAddressLink(networkId, address)).toEqual(
				'https://rinkeby.etherscan.io/address/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
			expect(getEtherscanTokenLink(networkId, address)).toEqual(
				'https://rinkeby.etherscan.io/token/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
		});

		it('returns the correct etherscan links for KOVAN', () => {
			const networkId = '42';

			expect(getEtherscanTxLink(networkId, txId)).toEqual(
				'https://kovan.etherscan.io/tx/0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d'
			);
			expect(getEtherscanAddressLink(networkId, address)).toEqual(
				'https://kovan.etherscan.io/address/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
			expect(getEtherscanTokenLink(networkId, address)).toEqual(
				'https://kovan.etherscan.io/token/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
		});

		it('returns MAINNET if the network is invalid', () => {
			const networkId = '9999';

			expect(getEtherscanTxLink(networkId, txId)).toEqual(
				'https://etherscan.io/tx/0x5251fa853a0f175ed60b9c03fe08acac3f25dbd912949ffa2f892767ea4e335d'
			);
			expect(getEtherscanAddressLink(networkId, address)).toEqual(
				'https://etherscan.io/address/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
			expect(getEtherscanTokenLink(networkId, address)).toEqual(
				'https://etherscan.io/token/0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4'
			);
		});
	});
});
