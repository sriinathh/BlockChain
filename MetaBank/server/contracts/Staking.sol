// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public token;
    struct Stake { uint256 amount; uint256 since; address owner; }
    mapping(address => Stake[]) public stakes;

    constructor(address _token) { token = IERC20(_token); }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "0");
        token.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].push(Stake(amount, block.timestamp, msg.sender));
    }

    function unstake(uint256 index) external nonReentrant {
        Stake storage s = stakes[msg.sender][index];
        require(s.amount > 0, "no stake");
        uint256 amount = s.amount;
        s.amount = 0;
        token.transfer(msg.sender, amount);
    }
}
