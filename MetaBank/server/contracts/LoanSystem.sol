// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LoanSystem {
    IERC20 public token;
    struct Loan { address borrower; uint256 amount; uint256 due; bool repaid; }
    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;

    constructor(address _token) { token = IERC20(_token); }

    function requestLoan(uint256 amount) external returns (uint256) {
        loanCount++;
        loans[loanCount] = Loan(msg.sender, amount, block.timestamp + 30 days, false);
        token.transfer(msg.sender, amount);
        return loanCount;
    }

    function repay(uint256 id, uint256 amount) external {
        Loan storage l = loans[id];
        require(!l.repaid, "already");
        token.transferFrom(msg.sender, address(this), amount);
        l.repaid = true;
    }
}
