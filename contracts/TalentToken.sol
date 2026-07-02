// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TalentToken is ERC20, Ownable {
    constructor() ERC20("Talent Token", "TT") Ownable(msg.sender) {
        // Mint initial supply of tokens to the deployer
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    // Mint tokens to companies when they buy/deposit funds
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
