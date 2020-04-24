import { Wallet } from '@ethersproject/wallet';
import queryString from 'query-string';

import { LOCAL_STORAGE_KEYS } from 'src/constants/storage';

export const getPermissionString = address =>
	`Proof of ownership over ${address}, provided to https://l2.synthetix.exchange.`;

export const getBurnerWallet = () => {
	let account;
	let wallet;

	// try from query string
	const qs = queryString.parse(location.search);
	if (qs && qs.account) {
		account = qs.account.replace(/-/g, ' ');
		try {
			// validate
			wallet = Wallet.fromMnemonic(account);
		} catch (e) {
			// invalid...
			account = getOrCreateAccount();
		}
		// only save a valid account
		localStorage.setItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT, account);
	} else {
		// try to grab it from local storage / create a new one
		account = getOrCreateAccount();
	}

	if (!wallet) {
		wallet = Wallet.fromMnemonic(account);
	}

	return wallet;
};

export const getOrCreateAccount = () => {
	let account = localStorage.getItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT);
	if (account == null) {
		account = Wallet.createRandom().mnemonic.phrase;
		localStorage.setItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT, account);
	}

	return account;
};
