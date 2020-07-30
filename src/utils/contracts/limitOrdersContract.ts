export const limitOrdersContract = {
	addresses: {
		1: '0x736d22180993e20cac87E9B2035560c1De455027',
		3: '0xC38776bdB0f02CFa66113F069D1f319f36901736',
		4: '0x3dCf67EdABe1B97B44ed6F34c91B4DA9ef8f4933',
		42: '0xc9c7613845A0c26169288C30eEF2604BeBf3A962',
	},
	abi: [
		'function newOrder(bytes32 sourceCurrencyKey, uint sourceAmount, bytes32 destinationCurrencyKey, uint minDestinationAmount, uint executionFee) payable public returns (uint)',
		'function cancelOrder(uint orderID) public',
		'function orders(uint orderID) public view returns (tuple(address submitter, bytes32 sourceCurrencyKey, uint256 sourceAmount, bytes32 destinationCurrencyKey, uint256 minDestinationAmount, uint256 weiDeposit, uint256 executionFee, uint256 executionTimestamp, uint256 destinationAmount, bool executed) user)',
		'event Order(uint indexed orderID, address indexed submitter, bytes32 sourceCurrencyKey, uint sourceAmount, bytes32 destinationCurrencyKey, uint minDestinationAmount, uint executionFee, uint weiDeposit)',
		'event Execute(uint indexed orderID, address indexed submitter, address executer)',
		'function withdrawOrders(uint[] orderIDs) public',
	],
};

export default limitOrdersContract;
