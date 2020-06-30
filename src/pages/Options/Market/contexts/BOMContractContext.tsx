import React, { FC, createContext, useContext } from 'react';
import { ethers } from 'ethers';

const BOMContractContext = createContext<ethers.Contract | null>(null);

type BOMContractContextProps = {
	children: React.ReactNode;
	contract: ethers.Contract;
};

export const BOMContractProvider: React.FC<BOMContractContextProps> = ({ children, contract }) => (
	<BOMContractContext.Provider value={contract}>{children}</BOMContractContext.Provider>
);

export const useBOMContractContext = () => useContext(BOMContractContext) as ethers.Contract;
