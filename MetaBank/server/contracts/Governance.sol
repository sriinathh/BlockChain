// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
contract Governance {
    struct Proposal { uint256 id; string description; uint256 votesFor; uint256 votesAgainst; }
    mapping(uint256 => Proposal) public proposals;
    uint256 public count;
    function propose(string calldata desc) external returns (uint256) { count++; proposals[count] = Proposal(count, desc, 0, 0); return count; }
    function vote(uint256 id, bool support) external { if (support) proposals[id].votesFor++; else proposals[id].votesAgainst++; }
}
