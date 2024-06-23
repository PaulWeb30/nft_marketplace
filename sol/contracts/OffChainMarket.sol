// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";
contract OffChainMarket is Ownable(msg.sender) {
	using ECDSA for bytes32;
	using MessageHashUtils for bytes32;

  mapping (bytes => bool) signatures;

  uint256 public nonce;

	function performBuy(address nftAddress, uint256 tokenId, uint256 price, uint256 _nonce, bytes calldata signature) 
	payable public {
		require(!signatures[signature], "Signature is already used");

		IERC721 nft = IERC721(nftAddress);
		require(nft.getApproved(tokenId) == address(this), "Approve failed");
		address nftOwner = nft.ownerOf(tokenId);

		bytes32 messageHash = keccak256(
     bytes(abi.encodePacked(nftAddress, tokenId, price, _nonce))
    );

	  address signer =  messageHash.toEthSignedMessageHash().recover(signature);

		require(signer == nftOwner, "Order creator is not nft owner");
		require(msg.value >= price, "Lack of money");
		
		signatures[signature] = true;
		nft.transferFrom(nftOwner, msg.sender, tokenId);
		payable(nftOwner).transfer(price);
	}

	function increaseNonce() public {
		nonce++;
	}          

  receive() external payable {
  }

	fallback() external payable {
  }
}