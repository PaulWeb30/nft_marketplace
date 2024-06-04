// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItems is ERC1155 {
    string public name = "GGItems";
    string public symbol = "GIG";

    address owner;
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    modifier onlyOwner {
        require(msg.sender == owner, "You are not owner");
        _;
    }
    constructor() ERC1155("https://i.redd.it/e0d41nsm4ps71.jpg") {
        owner = msg.sender;
        _mint(msg.sender, GOLD, 777, "");
        _mint(msg.sender, SILVER, 100, "");
        _mint(msg.sender, THORS_HAMMER, 1, "");
        _mint(msg.sender, SWORD, 10**3, "");
        _mint(msg.sender, SHIELD, 10**5, "");
    }

    function mint(address user, uint256 tokenId, uint256 value)
        public
        onlyOwner
    {
        
        _mint(user, tokenId, value, "");   
    }

    function uri(uint256 tokenId) public pure override returns (string memory) {
        // return string(abi.encodePacked("https://game.example/api/item/", Strings.toString(tokenId), ".json"));
        return "https://i.redd.it/e0d41nsm4ps71.jpg";
    }
}