export const orderbook_abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_linkedListSell',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_linkedListBuy',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'BuyOrderCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'SellOrderCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'pricePerOne',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: 'insertionId',
				type: 'bytes32',
			},
		],
		name: 'createBuyOrder',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'pricePerOne',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: 'insertionId',
				type: 'bytes32',
			},
		],
		name: 'createSellOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'generateId',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'linkedListBuy',
		outputs: [
			{
				internalType: 'contract LinkedList',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'linkedListSell',
		outputs: [
			{
				internalType: 'contract LinkedList',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'buyId',
				type: 'bytes32',
			},
		],
		name: 'matchBuyOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'sellId',
				type: 'bytes32',
			},
		],
		name: 'matchSellOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const
