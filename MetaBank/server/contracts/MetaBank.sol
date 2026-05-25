// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MetaBank {
    IERC20 public token;
    constructor(address _token) { token = IERC20(_token); }
    function ping() external pure returns (string memory) { return "MetaBank alive"; }
}
