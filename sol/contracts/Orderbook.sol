// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {LinkedListLib} from "./LinkedListLib.sol";
import "hardhat/console.sol";

contract Orderbook {
	using LinkedListLib for LinkedListLib.Storage;

	LinkedListLib.Storage public linkedListBuy; // desc order
	LinkedListLib.Storage public linkedListSell; // asc order

	struct Sell {
		bytes32 id;
		address creator;
		address tokenAddress;
		uint256 tokenId;
		uint256 amount;
		uint256 pricePerOne;
	}

	struct Buy {
		bytes32 id;
		address creator;
		address tokenAddress;
		uint256 tokenId;
		uint256 amount;
		uint256 pricePerOne;
	}

	mapping (bytes32 => Sell) sellInfo;
	mapping (bytes32 => Buy) buyInfo;

	event BuyOrderCreated(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);
	event SellOrderCreated(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);

	event BuyOrderUpdated(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);
	event SellOrderUpdated(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);

	event BuyOrderRemoved(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);
	event SellOrderRemoved(bytes32 id, address creator, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerOne);

	constructor() {}

	function createSellOrder(uint256 tokenId, address tokenAddress, uint256 amount, uint256 pricePerOne, bytes32 insertionId) 
	public {
		require(amount > 0, "Lack of amount");
		IERC1155 token = IERC1155(tokenAddress);
		require(token.isApprovedForAll(msg.sender, address(this)), "Approve failed");
		require(token.balanceOf(msg.sender, tokenId) >= amount, "Insufficient Tokens balance");

		if(insertionId != bytes32(0)) {
				uint256 previousNodeAmount = sellInfo[insertionId].amount;
				require(amount >= previousNodeAmount, "Off-chain calculation error");
		}
		bytes32 id = generateId(tokenAddress, tokenId, amount, pricePerOne, msg.sender);

		Sell memory sellOrder = Sell({
			id: id,
			creator: msg.sender,
			tokenAddress: tokenAddress,
			tokenId: tokenId,
			amount: amount,
			pricePerOne: pricePerOne
		});

		
		sellInfo[id] = sellOrder;
		linkedListSell.insertAfterNode(insertionId, id, amount, pricePerOne);
		emit SellOrderCreated(id, msg.sender, tokenAddress, tokenId, amount, pricePerOne);
		
		matchSellOrder(id);
	}

	function createBuyOrder(uint256 tokenId, address tokenAddress, uint256 amount, uint256 pricePerOne, bytes32 insertionId) 
	public payable {
		require(amount > 0, "Lack of amount");
		require(msg.value >= amount * pricePerOne, "Lack of ETH");
		IERC1155 token = IERC1155(tokenAddress);
		require(token.isApprovedForAll(msg.sender, address(this)), "Approve failed");

		if(insertionId != bytes32(0)) {
				uint256 previousNodeAmount = buyInfo[insertionId].amount;
				require(amount <= previousNodeAmount, "Off-chain calculation error");
		}

		bytes32 id = generateId(tokenAddress, tokenId, amount, pricePerOne, msg.sender);

		Buy memory buyOrder = Buy({
			id: id,
			creator: msg.sender,
			tokenAddress: tokenAddress,
			tokenId: tokenId,
			amount: amount,
			pricePerOne: pricePerOne
		});

		buyInfo[id] = buyOrder;
		linkedListBuy.insertAfterNode(insertionId, id, amount, pricePerOne);

		emit BuyOrderCreated(id, msg.sender, tokenAddress, tokenId, amount, pricePerOne);

		matchBuyOrder(id);
	}

	function matchBuyOrder(bytes32 buyId) public {
		Buy memory buyOrder = buyInfo[buyId];
		address buyOrderCreator = buyOrder.creator;
		address tokenAddress = buyOrder.tokenAddress;
		uint256 buyPrice = buyOrder.pricePerOne;
		uint256 buyAmount = buyOrder.amount;

		IERC1155 token = IERC1155(tokenAddress);
		bytes32 bestSellOrderId = getSellHead();

		Sell memory sellOrder = sellInfo[bestSellOrderId];
		uint256 sellOrderPrice = sellOrder.pricePerOne;
		uint256 sellOrderAmount = sellOrder.amount;
		address sellOrderCreator = sellOrder.creator;
		uint256 tokenId = sellOrder.tokenId;

		uint256 tokensToSend = buyAmount;
		uint256 ethToSend = sellOrderAmount * sellOrderPrice;
		int256 diff = int256(buyAmount) - int256(sellOrderAmount);
	

		if(buyPrice >= sellOrderPrice && bestSellOrderId != bytes32(0)) {
			if(diff > 0) {
				delete sellInfo[bestSellOrderId];
				linkedListSell.removeNode(bestSellOrderId);

				uint256 buyNewAmount = buyAmount - sellOrderAmount;
				linkedListBuy.updateNodeData(buyId, buyNewAmount, buyPrice);
				buyInfo[buyId].amount = buyNewAmount;

				tokensToSend = sellOrderAmount;
				
				emit BuyOrderUpdated(buyId, buyOrderCreator, tokenAddress, tokenId, buyNewAmount, buyPrice);
				emit SellOrderRemoved(bestSellOrderId, sellOrderCreator, tokenAddress, tokenId, sellOrderAmount, sellOrderPrice);
			} else if (diff < 0) {
				delete buyInfo[buyId];
				linkedListBuy.removeNode(buyId);

				uint256 sellNewAmount = sellOrderAmount - buyAmount;
				linkedListSell.updateNodeData(bestSellOrderId, sellNewAmount, sellOrderPrice);
				sellInfo[bestSellOrderId].amount = sellNewAmount;
				ethToSend = (sellOrderAmount - sellNewAmount) * sellOrderPrice;

				emit SellOrderUpdated(bestSellOrderId, sellOrderCreator, tokenAddress, tokenId, sellNewAmount, sellOrderPrice);
				emit BuyOrderRemoved(buyId, buyOrderCreator, tokenAddress, tokenId, buyAmount, buyPrice);
			} else {
				linkedListSell.removeNode(bestSellOrderId);
				delete sellInfo[bestSellOrderId];

				linkedListBuy.removeNode(buyId);
				delete buyInfo[buyId];

				emit BuyOrderRemoved(buyId, buyOrderCreator, tokenAddress, tokenId, buyAmount, buyPrice);
				emit SellOrderRemoved(bestSellOrderId, sellOrderCreator, tokenAddress, tokenId, sellOrderAmount, sellOrderPrice);
			}

			token.safeTransferFrom(sellOrderCreator, buyOrderCreator, tokenId, tokensToSend, "");
			payable(sellOrderCreator).transfer(ethToSend);
		}

	}


	function matchSellOrder(bytes32 sellId) public {
		Sell memory sellOrder = sellInfo[sellId];
		uint256 sellOrderPrice = sellOrder.pricePerOne;
		uint256 sellOrderAmount = sellOrder.amount;
		address sellOrderCreator = sellOrder.creator;
		uint256 tokenId = sellOrder.tokenId;
		address tokenAddress = sellOrder.tokenAddress;

		IERC1155 token = IERC1155(tokenAddress);
		bytes32 bestBuyOrderId = getBuyHead();
		
		Buy memory buyOrder = buyInfo[bestBuyOrderId];
		address buyOrderCreator = buyOrder.creator;		
		uint256 buyPrice = buyOrder.pricePerOne;
		uint256 buyAmount = buyOrder.amount;

		uint256 tokensToSend = buyAmount;
		uint256 ethToSend = sellOrderAmount * sellOrderPrice;
		int256 diff = int256(buyAmount) - int256(sellOrderAmount);

		if(sellOrderPrice <= buyPrice && bestBuyOrderId != bytes32(0)) {

			if(diff > 0) {
				delete sellInfo[sellId];
				linkedListSell.removeNode(sellId);

				uint256 buyNewAmount = buyAmount - sellOrderAmount;
				linkedListBuy.updateNodeData(bestBuyOrderId, buyNewAmount, buyPrice);
				buyInfo[bestBuyOrderId].amount = buyNewAmount;
				tokensToSend = sellOrderAmount;

				emit BuyOrderUpdated(bestBuyOrderId, buyOrderCreator, tokenAddress, tokenId, buyNewAmount, buyPrice);
				emit SellOrderRemoved(sellId, sellOrderCreator, tokenAddress, tokenId, sellOrderAmount, sellOrderPrice);
			} else if (diff < 0) {
				delete buyInfo[bestBuyOrderId];
				linkedListBuy.removeNode(bestBuyOrderId);

				uint256 sellNewAmount = sellOrderAmount - buyAmount;
				linkedListSell.updateNodeData(sellId, sellNewAmount, sellOrderPrice);
				sellInfo[sellId].amount = sellNewAmount;
				ethToSend = (sellOrderAmount - sellNewAmount) * sellOrderPrice;

				emit SellOrderUpdated(sellId, sellOrderCreator, tokenAddress, tokenId, sellNewAmount, sellOrderPrice);
				emit BuyOrderRemoved(bestBuyOrderId, buyOrderCreator, tokenAddress, tokenId, buyAmount, buyPrice);
			} else {
				linkedListSell.removeNode(sellId);
				delete sellInfo[sellId];

				linkedListBuy.removeNode(bestBuyOrderId);
				delete buyInfo[bestBuyOrderId];

				emit BuyOrderRemoved(bestBuyOrderId, buyOrderCreator, tokenAddress, tokenId, buyAmount, buyPrice);
				emit SellOrderRemoved(sellId, sellOrderCreator, tokenAddress, tokenId, sellOrderAmount, sellOrderPrice);
			}

			token.safeTransferFrom(sellOrderCreator, buyOrderCreator, tokenId, tokensToSend, "");
			payable(sellOrderCreator).transfer(ethToSend);
		}
	}

	function generateId(address tokenAddress, uint256 tokenId, uint256 amount, uint256 price, address sender) public pure returns(bytes32 id) {
		id = keccak256(abi.encodePacked(tokenAddress, tokenId, amount, price, sender));
	}

	function getBuyHead() public view returns(bytes32) {
		return LinkedListLib.getHead(linkedListBuy);
	}

	function getSellHead() public view returns(bytes32) {
		return LinkedListLib.getHead(linkedListSell);
	}
}