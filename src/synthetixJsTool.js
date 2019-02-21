import { SynthetixJs } from '../node_modules/synthetix-js/src/index';
let SynthetixJsTools = {
  initialized: false,
  signers: SynthetixJs.signers,
  setContractSettings: function(contractSettings) {
    this.synthetixJs = new SynthetixJs(contractSettings);
    this.signer = this.synthetixJs.contractSettings.signer;
    this.provider = this.synthetixJs.contractSettings.provider;
    this.util = this.synthetixJs.util;
    this.utils = this.synthetixJs.utils;
    this.initialized = true;
  },
};

export default SynthetixJsTools;
