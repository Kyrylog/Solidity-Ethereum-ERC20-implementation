pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract GLDToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Datsiuk1, "DST") {
        _mint(address(this), initialSupply);
    }
    receive() payable external {
        uint256 amountSent = msg.value;
        uint256 tokens_left = balanceOf(address(this));
        require(amountSent > 0, "You need to send some ether");
        require(amountSent*100 <= tokens_left, "Not enough tokens left in contract ownership");
        uint256 sender_balance = balanceOf(msg.sender);
        require(sender_balance < 500, "User can't have more then 500 tokens");
        uint256 send_amout = Math.min(500-sender_balance, amountSent*100);
        transfer(msg.sender, send_amout);
    }
}
