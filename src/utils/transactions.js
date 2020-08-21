import { GAS_LIMIT_BUFFER } from '../constants/transaction';

export const normalizeGasLimit = (gasLimit) => gasLimit + GAS_LIMIT_BUFFER;
