//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Khlopiachyi is ERC20 {
    uint256 private _totalSupply = 100000;
    uint16 private _maxTokenAmount = 500;
    uint8 private _tokenMultiplier = 100;

    mapping(address => uint256) _tokenHolders;

    constructor() ERC20("Khlopiachyi", "KHL") {
        _mint(msg.sender, _totalSupply / 2);
    }

    function sendTokens() public payable {
        require(msg.value > 0, "Value should be more than 0");

        uint256 tokenAmount = msg.value * _tokenMultiplier / 1 ether;
        uint256 tokenBalance = _tokenHolders[msg.sender];

        require(tokenAmount + tokenBalance <= _maxTokenAmount, "Token total should be less or equal then 500");

        _mint(msg.sender, tokenAmount);
        _tokenHolders[msg.sender] += tokenAmount;
    }

    function getTokenHolderBalance() public view returns (uint256) {
        return _tokenHolders[msg.sender];
    }
}
