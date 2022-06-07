pragma solidity ^0.8.0;

import './KhlopiachyiToken.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract TokenHandler is Ownable {
    mapping(address => uint256) internal _balances;

    KhlopiachyiToken public token;
    uint256 private _tokenMultiplier;
    uint256 private _maxAmount;

    constructor(
        address token_,
        uint256 multiplier_,
        uint256 maxAmount_
    ) {
        token = KhlopiachyiToken(token_);
        _tokenMultiplier = multiplier_;
        _maxAmount = maxAmount_;
    }

    function sendETH() public payable returns (uint256) {
        require(msg.value > 0, 'You did not send any ETH');

        uint256 result = msg.value * _tokenMultiplier;

        uint256 senderCurrentAmount = token.balanceOf(msg.sender);
        require(senderCurrentAmount + result < _maxAmount, 'User is allowed to hold not more than 500 tokens');

        bool err = token.transfer(msg.sender, result);
        require(err, 'Transaction has been failed');

        return result;
    }

    function tokenMultiplier() public view returns (uint256) {
        return _tokenMultiplier;
    }

    function maxAmount() public view returns (uint256) {
        return _maxAmount;
    }
}