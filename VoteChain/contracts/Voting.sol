// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VoterRegistry.sol";
import "./ElectionManager.sol";

contract Voting {
    address public electionCommission;
    VoterRegistry public voterRegistry;
    ElectionManager public electionManager;

    struct Vote {
        uint256 candidateId;
        bytes32 blockchainHash;
        uint256 timestamp;
    }

    // candidateId => voteCount
    mapping(uint256 => uint256) private candidateVotes;
    
    // voterHash => Vote
    mapping(string => Vote) private auditVotes;

    event VoteCast(string indexed voterHash, uint256 indexed candidateId, bytes32 blockchainHash);

    modifier onlyEC() {
        require(msg.sender == electionCommission, "Caller is not the Election Commission");
        _;
    }

    constructor(address _voterRegistry, address _electionManager) {
        electionCommission = msg.sender;
        voterRegistry = VoterRegistry(_voterRegistry);
        electionManager = ElectionManager(_electionManager);
    }

    function castVote(
        string memory _aadhaarHash,
        uint256 _candidateId
    ) external {
        // Validation checks
        require(electionManager.isElectionActive(), "Election is not active");
        require(voterRegistry.isVoterRegistered(_aadhaarHash), "Voter is not registered");
        require(!voterRegistry.hasVoterVoted(_aadhaarHash), "Voter has already voted");
        
        // Confirm voter wallet matches caller
        address expectedWallet = address(0);
        (,,, expectedWallet) = voterRegistry.getVoterDetails(_aadhaarHash);
        require(msg.sender == expectedWallet, "Wallet address mismatch");

        // Verify candidate
        string memory cConstituency = "";
        bool isApproved = false;
        (,,, cConstituency, isApproved) = electionManager.getCandidate(_candidateId);
        require(isApproved, "Candidate not approved");

        // Verify voter is in correct constituency
        string memory vConstituency = voterRegistry.getVoterConstituency(_aadhaarHash);
        require(
            keccak256(abi.encodePacked(cConstituency)) == keccak256(abi.encodePacked(vConstituency)),
            "Constituency mismatch"
        );

        // Generate block hash for transaction
        bytes32 blockchainHash = keccak256(abi.encodePacked(_aadhaarHash, _candidateId, block.timestamp, block.prevrandao));

        // Save vote details for auditing
        auditVotes[_aadhaarHash] = Vote({
            candidateId: _candidateId,
            blockchainHash: blockchainHash,
            timestamp: block.timestamp
        });

        // Lock voting status
        voterRegistry.markAsVoted(_aadhaarHash);

        // Record vote
        candidateVotes[_candidateId] += 1;

        emit VoteCast(_aadhaarHash, _candidateId, blockchainHash);
    }

    function getCandidateVotes(uint256 _candidateId) external view returns (uint256) {
        return candidateVotes[_candidateId];
    }

    function getVoteAudit(string memory _aadhaarHash) external view returns (
        uint256 candidateId,
        bytes32 blockchainHash,
        uint256 timestamp
    ) {
        Vote memory v = auditVotes[_aadhaarHash];
        require(v.timestamp > 0, "No audit record for voter");
        return (v.candidateId, v.blockchainHash, v.timestamp);
    }
}
