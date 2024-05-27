// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Market is Ownable(msg.sender) {
	uint256 public fee = 1;

	struct Proposal {
		uint256 id;
		address nft;
		uint256 tokenId;
		address nftOwner;
		address proposer;
		uint256 proposedPrice;
		uint256 orderId;
	}

	struct Order {
		uint256 id;
		address creator;
		address nft;
		uint256 tokenId;
		uint256 price;
	}

	mapping (uint256 orderId => Order) public orders;
	mapping (uint256 proposalId => Proposal) public proposals;

	event OrderCreated(uint256 orderId, address creator, uint256 price, address nft, uint256 tokenId);
	event ProposalCreated(uint256 proposeId, address proposer, uint256 proposedPrice, address nft, uint256 tokenId, address nftOwner, uint256 orderId);
	event ProposalCanceled(uint256 proposeId, address proposer, uint256 proposedPrice, address nft, uint256 tokenId, address nftOwner, uint256 orderId);
	event ProposalSelected(uint256 proposeId, address proposer, uint256 proposedPrice, address nft, uint256 tokenId, address nftOwner, uint256 orderId);
	event Buy(uint256 orderId, address buyer, uint256 tokenId, uint256 price);

	modifier isOrderExists(uint256 orderId) {
		Order memory order = orders[orderId];
		address creator = order.creator;
		require(creator != address(0), "This order doesnt exist");
		_;
	}

	modifier isProposalExists(uint256 proposalId) {
		Proposal memory proposal = proposals[proposalId];	
		address proposer = proposal.proposer;
		require(proposer != address(0), "This proposal doesnt exist");
		_;
	}
	function createSellOrder(address nftAddress, uint256 tokenId, uint256 price) public payable {
		require(msg.value >= price * fee / 100, "You must pay fee to sell nft");
		IERC721 nft = IERC721(nftAddress);
		require(msg.sender == nft.ownerOf(tokenId), "You are not owner of the nft");
		
		uint256 orderId = generateId(nftAddress, tokenId, price, msg.sender);
		orders[orderId] = Order(orderId, msg.sender, nftAddress, tokenId, price);

		emit OrderCreated(orderId, msg.sender, price, nftAddress, tokenId); 
	}

	function buy(uint256 orderId) public payable isOrderExists(orderId) {
		Order memory order = orders[orderId];
		uint256 price = order.price;

		require(msg.value >= price, "Lack of money");
		
		address nftAddress = order.nft;
		uint256 tokenId = order.tokenId;
		IERC721 nft = IERC721(nftAddress);
		address nftOwner = order.creator;

		nft.transferFrom(nftOwner, msg.sender, tokenId);
		delete orders[orderId];
		payable(nftOwner).transfer(price);

		emit Buy(orderId, msg.sender, tokenId, price);
	}


	function createProposal(uint256 orderId, uint256 proposedPrice) public payable isOrderExists(orderId) {
		require(msg.value >= proposedPrice, "You didnt sent enough ETH");

		Order memory order = orders[orderId];
		uint256 currentPrice = order.price;
		address nftAddress = order.nft;
		uint256 tokenId = order.tokenId;
		address nftOwner = order.creator;
		
		require(currentPrice > proposedPrice, "You can easily buy token without proposal");

		uint256 proposalId = generateId(nftAddress, tokenId, proposedPrice, msg.sender);
		proposals[proposalId] = Proposal(proposalId, nftAddress, tokenId, nftOwner, msg.sender, proposedPrice, orderId);

		emit ProposalCreated(proposalId, msg.sender, proposedPrice, nftAddress, tokenId, nftOwner, orderId); 
	}

	function selectProposer(uint256 proposalId) public isProposalExists(proposalId) {
		Proposal memory proposal = proposals[proposalId];				
		require(msg.sender == proposal.nftOwner, "You are not owner");

		address nftAddress = proposal.nft;
		IERC721 nft = IERC721(nftAddress);
		
		
		uint256 tokenId = proposal.tokenId;
		uint256 orderId = proposal.orderId;
		address nftOwner = proposal.nftOwner;
		address proposer = proposal.proposer;
		uint256 proposedPrice = proposal.proposedPrice;
		nft.transferFrom(msg.sender, proposer, tokenId);

		payable(msg.sender).transfer(proposedPrice);

		emit ProposalSelected(proposalId, proposer, proposedPrice, nftAddress, tokenId, nftOwner, orderId); 
	}


	function cancelProposal(uint256 proposalId) public isProposalExists(proposalId) {
		Proposal memory proposal = proposals[proposalId];
		require(msg.sender == proposal.proposer, "You are not proposer");

		uint256 proposedPrice = proposal.proposedPrice;
		address proposer = proposal.proposer;
		uint256 feeAmount = proposedPrice * fee / 100;
		uint256 amountToReturn = proposedPrice - feeAmount;
		
		address nft = proposal.nft;
		uint256 tokenId = proposal.tokenId;
		uint256 orderId = proposal.orderId;
		address nftOwner = proposal.nftOwner;

		delete proposals[proposalId];

		payable(msg.sender).transfer(amountToReturn);

		emit ProposalCanceled(proposalId, proposer, proposedPrice, nft, tokenId, nftOwner, orderId); 
	}


	function generateId(address nftAddress, uint256 tokenId, uint256 price, address sender) public pure returns(uint256 id) {
		id = uint256(keccak256(abi.encodePacked(nftAddress, tokenId, price, sender)));
	}

  receive() external payable {
  }

	fallback() external payable {
  }
}