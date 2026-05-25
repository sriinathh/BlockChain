// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoterRegistry {
    address public electionCommission;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        string constituency;
        string name;
        string aadhaarHash;
        address walletAddress;
    }

    mapping(string => Voter) private voters; // Maps Aadhaar hash to Voter
    mapping(address => string) private walletToAadhaar; // Maps wallet address to Aadhaar hash

    event VoterRegistered(string indexed aadhaarHash, string constituency, address indexed wallet);
    event VoterMarkedAsVoted(string indexed aadhaarHash);

    modifier onlyEC() {
        require(msg.sender == electionCommission, "Caller is not the Election Commission");
        _;
    }

    constructor() {
        electionCommission = msg.sender;
    }

    function registerVoter(
        string memory _name,
        string memory _aadhaarHash,
        string memory _constituency,
        address _wallet
    ) external onlyEC {
        require(!voters[_aadhaarHash].isRegistered, "Voter already registered");
        require(voters[_aadhaarHash].walletAddress == address(0), "Wallet already associated");

        voters[_aadhaarHash] = Voter({
            isRegistered: true,
            hasVoted: false,
            constituency: _constituency,
            name: _name,
            aadhaarHash: _aadhaarHash,
            walletAddress: _wallet
        });

        walletToAadhaar[_wallet] = _aadhaarHash;

        emit VoterRegistered(_aadhaarHash, _constituency, _wallet);
    }

    function isVoterRegistered(string memory _aadhaarHash) external view returns (bool) {
        return voters[_aadhaarHash].isRegistered;
    }

    function hasVoterVoted(string memory _aadhaarHash) external view returns (bool) {
        return voters[_aadhaarHash].hasVoted;
    }

    function getVoterConstituency(string memory _aadhaarHash) external view returns (string memory) {
        require(voters[_aadhaarHash].isRegistered, "Voter not registered");
        return voters[_aadhaarHash].constituency;
    }

    function getVoterDetails(string memory _aadhaarHash) external view returns (
        string memory name,
        string memory constituency,
        bool hasVoted,
        address walletAddress
    ) {
        require(voters[_aadhaarHash].isRegistered, "Voter not registered");
        Voter memory voter = voters[_aadhaarHash];
        return (voter.name, voter.constituency, voter.hasVoted, voter.walletAddress);
    }

    function getAadhaarByWallet(address _wallet) external view returns (string memory) {
        return walletToAadhaar[_wallet];
    }

    function markAsVoted(string memory _aadhaarHash) external {
        // Can be called by EC or voting contract
        require(voters[_aadhaarHash].isRegistered, "Voter not registered");
        require(!voters[_aadhaarHash].hasVoted, "Voter has already voted");
        
        voters[_aadhaarHash].hasVoted = true;
        emit VoterMarkedAsVoted(_aadhaarHash);
    }
}
