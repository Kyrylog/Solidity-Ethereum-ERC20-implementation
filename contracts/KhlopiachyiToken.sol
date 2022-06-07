pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract KhlopiachyiToken is ERC20 {
    mapping(address => uint256) internal _balances;

    string private _name;
    string private _symbol;
    uint256 private _totalSupply;


    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) ERC20(_name, _symbol) {
        _mint(_msgSender(), initialSupply);
        _name = name_;
        _symbol = symbol_;
        _totalSupply = 100000000;
    }


    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }
}