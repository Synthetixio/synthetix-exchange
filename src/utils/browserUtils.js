const chromeExtension =
	'https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn';
const firefoxExtension = 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
const operaExtension = 'https://addons.opera.com/en/extensions/details/metamask/';

export const getExtensionUri = () => {
	// Opera 8.0+
	const isOpera =
		(!!window.opr && !!window.opr.addons) ||
		!!window.opera ||
		navigator.userAgent.indexOf(' OPR/') >= 0;
	if (isOpera) return operaExtension;
	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== 'undefined';
	if (isFirefox) return firefoxExtension;
	// Chrome 1+
	const isChrome = !!window.chrome && !!window.chrome.webstore;
	if (isChrome) return chromeExtension;
};
