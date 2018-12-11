import { HavvenJs } from 'havven-js';

let SynthetixJsTools = {
  initialized: false,
  signers: HavvenJs.signers,
  setContractSettings: function(contractSettings) {
    this.havvenJs = new HavvenJs(contractSettings);
    this.signer = this.havvenJs.contractSettings.signer;
    this.provider = this.havvenJs.contractSettings.provider;
    this.util = this.havvenJs.util;
    this.utils = this.havvenJs.utils;
    this.initialized = true;
  },
};

export default SynthetixJsTools;
