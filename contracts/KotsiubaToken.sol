//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KotsiubaToken is ERC20, ERC20Burnable, Ownable {
    uint256 private _maxTokenAllowed;
    uint256 private _tokenRate;

    constructor(uint256 maxTokenAllowed_, uint256 tokenRate_)
        ERC20("KotsiubaToken", "KTSB")
    {
        _maxTokenAllowed = maxTokenAllowed_;
        _tokenRate = tokenRate_;
    }

    function maxTokenAllowed() public view returns (uint256) {
        return _maxTokenAllowed;
    }

    function tokenRate() public view returns (uint256) {
        return _tokenRate;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    receive() external payable {
        address to = _msgSender();
        uint256 amount = msg.value * _tokenRate;
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        uint256 expectedValue = balanceOf(to) + amount;
        require(
            expectedValue <= _maxTokenAllowed,
            "KotsiubaToken: transfer amount exceeds max token allowed"
        );
    }
}
