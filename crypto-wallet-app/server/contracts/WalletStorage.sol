// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletStorage {
    struct TxRecord {
        address sender;
        address receiver;
        uint256 amount;
        string txHash;
        uint256 timestamp;
    }

    TxRecord[] public transactions;

    event TransactionSaved(address indexed sender, address indexed receiver, uint256 amount, string txHash, uint256 timestamp);

    function saveTransaction(address sender, address receiver, uint256 amount, string calldata txHash) external {
        transactions.push(TxRecord(sender, receiver, amount, txHash, block.timestamp));
        emit TransactionSaved(sender, receiver, amount, txHash, block.timestamp);
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }
}
