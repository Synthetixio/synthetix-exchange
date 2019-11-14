import { SynthetixJs } from 'synthetix-js';
let SynthetixJsTools = {
	initialized: false,
	signers: SynthetixJs.signers,
	setContractSettings: function(contractSettings) {
		this.synthetixJs = new SynthetixJs(contractSettings);
		this.signer = this.synthetixJs.contractSettings.signer;
		this.provider = this.synthetixJs.contractSettings.provider;
		this.util = this.synthetixJs.util;
		this.utils = this.synthetixJs.utils;
		this.ethersUtils = SynthetixJs.utils;
		this.initialized = true;
	},
	getUtf8Bytes: function(str) {
		return SynthetixJsTools.ethersUtils.formatBytes32String(str);
	},
};

export default SynthetixJsTools;
