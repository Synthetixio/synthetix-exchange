import React, { createContext, useContext, useEffect, useState } from 'react';
import snxJSConnector from 'utils/snxJSConnector';

const LoanContext = createContext(null);

export const LoanProvider = ({ children }) => {
	const [contractType, setContractType] = useState('sETH');
	const [contract, setContract] = useState(null);

	useEffect(() => {
		const getSelectedContract = async () => {
			const {
				snxJS: { EtherCollateral },
				etherCollateralsUSDContract,
			} = snxJSConnector;
			if (contractType === 'sETH') {
				setContract(EtherCollateral.contract);
			} else {
				setContract(etherCollateralsUSDContract);
			}
		};
		getSelectedContract();
	}, [contractType]);

	return (
		<LoanContext.Provider value={{ contract, setContract, contractType, setContractType }}>
			{children}
		</LoanContext.Provider>
	);
};

export const useLoanContext = () => useContext(LoanContext);
