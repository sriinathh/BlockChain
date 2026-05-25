// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IMetaToken is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract MetaBank is Ownable, ReentrancyGuard {
    IMetaToken public token;

    mapping(address => uint256) public ethBalances;
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public isBlacklisted;
    mapping(address => bool) public isOfficer;
    mapping(address => bool) public isKycVerified;

    // Staking logic
    struct Stake {
        uint256 amount;
        uint256 since;
        bool active;
    }
    mapping(address => Stake) public stakes;
    uint256 public stakingInterestRate = 5; // 5% APY

    // Loan logic
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 dueDate;
        bool approved;
        bool repaid;
        bool active;
    }
    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;

    // Transaction history
    struct TransactionRecord {
        address sender;
        address receiver;
        uint256 amount;
        string tokenType; // "ETH" or "MBT"
        string category; // "DEPOSIT", "WITHDRAW", "TRANSFER", "STAKE", "UNSTAKE", "LOAN_PAYOUT", "LOAN_REPAY"
        uint256 timestamp;
    }
    TransactionRecord[] public txRecords;

    event Deposited(address indexed user, uint256 amount, string tokenType);
    event Withdrawn(address indexed user, uint256 amount, string tokenType);
    event Transferred(address indexed from, address indexed to, uint256 amount, string tokenType);
    event Blacklisted(address indexed user, bool value);
    event OfficerRoleToggled(address indexed user, bool value);
    event KycStatusUpdated(address indexed user, bool value);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event LoanApplied(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);

    modifier onlyOfficer() {
        require(isOfficer[msg.sender] || msg.sender == owner(), "Not an officer");
        _;
    }

    modifier notBlacklisted() {
        require(!isBlacklisted[msg.sender], "Account blacklisted");
        _;
    }

    constructor(address _token) Ownable(msg.sender) {
        token = IMetaToken(_token);
    }

    // Role setup
    function setOfficer(address user, bool value) external onlyOwner {
        isOfficer[user] = value;
        emit OfficerRoleToggled(user, value);
    }

    // Blacklisting / Anomaly Prevention
    function setBlacklist(address user, bool value) external onlyOfficer {
        isBlacklisted[user] = value;
        emit Blacklisted(user, value);
    }

    function setKycStatus(address user, bool value) external onlyOfficer {
        isKycVerified[user] = value;
        emit KycStatusUpdated(user, value);
    }

    // ETH Banking
    function depositEth() external payable notBlacklisted nonReentrant {
        require(msg.value > 0, "Deposit > 0");
        ethBalances[msg.sender] += msg.value;
        txRecords.push(TransactionRecord(address(0), msg.sender, msg.value, "ETH", "DEPOSIT", block.timestamp));
        emit Deposited(msg.sender, msg.value, "ETH");
    }

    function withdrawEth(uint256 amount) external notBlacklisted nonReentrant {
        require(ethBalances[msg.sender] >= amount, "Insufficient ETH");
        ethBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        txRecords.push(TransactionRecord(msg.sender, address(0), amount, "ETH", "WITHDRAW", block.timestamp));
        emit Withdrawn(msg.sender, amount, "ETH");
    }

    function transferEth(address to, uint256 amount) external notBlacklisted nonReentrant {
        require(ethBalances[msg.sender] >= amount, "Insufficient ETH");
        require(!isBlacklisted[to], "Recipient blacklisted");
        ethBalances[msg.sender] -= amount;
        ethBalances[to] += amount;
        txRecords.push(TransactionRecord(msg.sender, to, amount, "ETH", "TRANSFER", block.timestamp));
        emit Transferred(msg.sender, to, amount, "ETH");
    }

    // MBT Banking
    function depositToken(uint256 amount) external notBlacklisted nonReentrant {
        require(amount > 0, "Deposit > 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        tokenBalances[msg.sender] += amount;
        txRecords.push(TransactionRecord(msg.sender, address(this), amount, "MBT", "DEPOSIT", block.timestamp));
        emit Deposited(msg.sender, amount, "MBT");
    }

    function withdrawToken(uint256 amount) external notBlacklisted nonReentrant {
        require(tokenBalances[msg.sender] >= amount, "Insufficient MBT");
        tokenBalances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        txRecords.push(TransactionRecord(msg.sender, address(0), amount, "MBT", "WITHDRAW", block.timestamp));
        emit Withdrawn(msg.sender, amount, "MBT");
    }

    function transferToken(address to, uint256 amount) external notBlacklisted nonReentrant {
        require(tokenBalances[msg.sender] >= amount, "Insufficient MBT");
        require(!isBlacklisted[to], "Recipient blacklisted");
        tokenBalances[msg.sender] -= amount;
        tokenBalances[to] += amount;
        txRecords.push(TransactionRecord(msg.sender, to, amount, "MBT", "TRANSFER", block.timestamp));
        emit Transferred(msg.sender, to, amount, "MBT");
    }

    // Staking utility
    function stakeTokens(uint256 amount) external notBlacklisted nonReentrant {
        require(amount > 0, "Amount > 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Staking transfer failed");

        if (stakes[msg.sender].active) {
            // Claim current rewards first
            uint256 reward = calculateStakingReward(msg.sender);
            if (reward > 0) {
                token.mint(msg.sender, reward);
            }
            stakes[msg.sender].amount += amount;
            stakes[msg.sender].since = block.timestamp;
        } else {
            stakes[msg.sender] = Stake(amount, block.timestamp, true);
        }
        txRecords.push(TransactionRecord(msg.sender, address(this), amount, "MBT", "STAKE", block.timestamp));
        emit Staked(msg.sender, amount);
    }

    function unstakeTokens() external notBlacklisted nonReentrant {
        require(stakes[msg.sender].active, "No active stake");
        uint256 amount = stakes[msg.sender].amount;
        uint256 reward = calculateStakingReward(msg.sender);
        
        delete stakes[msg.sender];
        require(token.transfer(msg.sender, amount), "Unstaking transfer failed");
        if (reward > 0) {
            token.mint(msg.sender, reward);
        }
        txRecords.push(TransactionRecord(address(this), msg.sender, amount, "MBT", "UNSTAKE", block.timestamp));
        emit Unstaked(msg.sender, amount, reward);
    }

    function calculateStakingReward(address user) public view returns (uint256) {
        if (!stakes[user].active) return 0;
        uint256 duration = block.timestamp - stakes[user].since;
        // reward = amount * rate * duration / (365 days * 100)
        return (stakes[user].amount * stakingInterestRate * duration) / (365 days * 100);
    }

    // Loan system
    function applyForLoan(uint256 amount) external notBlacklisted returns (uint256) {
        require(amount > 0, "Amount > 0");
        loanCount++;
        loans[loanCount] = Loan({
            id: loanCount,
            borrower: msg.sender,
            amount: amount,
            interestRate: 8, // 8% fixed
            dueDate: block.timestamp + 30 days,
            approved: false,
            repaid: false,
            active: true
        });
        emit LoanApplied(loanCount, msg.sender, amount);
        return loanCount;
    }

    function approveLoan(uint256 loanId) external onlyOfficer nonReentrant {
        Loan storage l = loans[loanId];
        require(l.active, "Loan not active");
        require(!l.approved, "Loan already approved");
        l.approved = true;
        // payout in tokens directly minted
        token.mint(l.borrower, l.amount);
        txRecords.push(TransactionRecord(address(this), l.borrower, l.amount, "MBT", "LOAN_PAYOUT", block.timestamp));
        emit LoanApproved(loanId, l.borrower, l.amount);
    }

    function repayLoan(uint256 loanId, uint256 amount) external notBlacklisted nonReentrant {
        Loan storage l = loans[loanId];
        require(l.approved, "Loan not approved");
        require(!l.repaid, "Loan already repaid");
        require(l.borrower == msg.sender, "Not borrower");
        
        uint256 totalRepay = l.amount + (l.amount * l.interestRate / 100);
        require(amount >= totalRepay, "Insufficient repayment amount");

        require(token.transferFrom(msg.sender, address(this), totalRepay), "Repayment failed");
        l.repaid = true;
        l.active = false;
        txRecords.push(TransactionRecord(msg.sender, address(this), totalRepay, "MBT", "LOAN_REPAY", block.timestamp));
        emit LoanRepaid(loanId, msg.sender, totalRepay);
    }

    function getTxRecordsCount() external view returns (uint256) {
        return txRecords.length;
    }
}
