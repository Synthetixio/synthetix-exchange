export const limitOrdersContract = {
	addresses: {
		1: '0xF771A01C488c24F7755Ad1824650D3e243B65A9c',
		3: '0xF771A01C488c24F7755Ad1824650D3e243B65A9c',
		4: '0xF771A01C488c24F7755Ad1824650D3e243B65A9c',
		42: '0xF771A01C488c24F7755Ad1824650D3e243B65A9c',
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
