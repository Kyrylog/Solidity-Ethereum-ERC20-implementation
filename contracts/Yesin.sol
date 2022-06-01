// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Yesin is ERC20 {
    uint256 constant private maxAllowTokens = 500;

    constructor(uint256 _supply) ERC20("Yesin", "YSN") {
         _mint(msg.sender, _supply);
    }

    function mineTokens(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function receivePayment() public view returns (uint256) {
        uint256 total = totalSupply();
        return SafeMath.mul(total, 100);
   }

   function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        uint256 expectedValue = balanceOf(to) + amount;
        require(expectedValue <= maxAllowTokens, "The user is allowed to have a maximum of 500 tokens.");
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}