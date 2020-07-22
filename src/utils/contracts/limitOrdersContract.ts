export const limitOrdersContract = {
	addresses: {
		1: '0x0000000000000000000000000000000000000001',
		3: '0x0000000000000000000000000000000000000001',
		4: '0x0000000000000000000000000000000000000001',
		42: '0x0000000000000000000000000000000000000001',
	},
	abi: [
		'function newOrder(bytes32 sourceCurrencyKey, uint sourceAmount, bytes32 destinationCurrencyKey, uint minDestinationAmount, uint executionFee) payable public returns (uint)',
		'function cancelOrder(uint orderID) public',
		'function orders(uint orderID) public view returns (tuple(address submitter, bytes32 sourceCurrencyKey, uint256 sourceAmount, bytes32 destinationCurrencyKey, uint256 minDestinationAmount, uint256 weiDeposit, uint256 executionFee, uint256 executionTimestamp, uint256 destinationAmount, bool executed) user)',
		'event Order(uint indexed orderID, address indexed submitter, bytes32 sourceCurrencyKey, uint sourceAmount, bytes32 destinationCurrencyKey, uint minDestinationAmount, uint executionFee, uint weiDeposit)',
		'event Execute(uint indexed orderID, address indexed submitter, address executer)',
		'function withdrawOrders(uint[] memory orderIDs) public',
	],
};

export default limitOrdersContract;
