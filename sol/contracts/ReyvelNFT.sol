// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/interface";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ReyvelNFT is ERC721URIStorage, Ownable(msg.sender) {
    uint256 public counter;
    constructor() ERC721("Reyvel", "RYL") {}

    function mint(address user, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = counter;
        _mint(user, newItemId);
        _setTokenURI(newItemId, tokenURI);
        counter++;
        return newItemId;       
    }
    
}