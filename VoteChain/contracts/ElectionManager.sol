// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ElectionManager {
    address public electionCommission;

    enum ElectionStatus { NotStarted, Active, Completed }
    
    struct Election {
        string title;
        uint256 startDate;
        uint256 endDate;
        ElectionStatus status;
    }

    struct Candidate {
        string name;
        string party;
        string symbol;
        string constituency;
        bool isApproved;
    }

    Election public currentElection;
    Candidate[] private candidates;
    
    mapping(string => bool) private constituencies; // constituency name => active state
    mapping(uint256 => mapping(string => uint256)) private constituencyCandidateIndex; // constituency => candidateName => index

    event ElectionStateChanged(ElectionStatus newStatus);
    event CandidateRegistered(uint256 indexed candidateId, string name, string party, string constituency);
    event ConstituencyAdded(string constituency);

    modifier onlyEC() {
        require(msg.sender == electionCommission, "Caller is not the Election Commission");
        _;
    }

    constructor() {
        electionCommission = msg.sender;
    }

    function createElection(
        string memory _title,
        uint256 _startDate,
        uint256 _endDate
    ) external onlyEC {
        currentElection = Election({
            title: _title,
            startDate: _startDate,
            endDate: _endDate,
            status: ElectionStatus.NotStarted
        });
        emit ElectionStateChanged(ElectionStatus.NotStarted);
    }

    function setElectionStatus(ElectionStatus _status) external onlyEC {
        currentElection.status = _status;
        emit ElectionStateChanged(_status);
    }

    function addConstituency(string memory _constituency) external onlyEC {
        constituencies[_constituency] = true;
        emit ConstituencyAdded(_constituency);
    }

    function isConstituencyValid(string memory _constituency) external view returns (bool) {
        return constituencies[_constituency];
    }

    function registerCandidate(
        string memory _name,
        string memory _party,
        string memory _symbol,
        string memory _constituency
    ) external onlyEC {
        require(constituencies[_constituency], "Invalid constituency");
        
        candidates.push(Candidate({
            name: _name,
            party: _party,
            symbol: _symbol,
            constituency: _constituency,
            isApproved: true
        }));

        uint256 candidateId = candidates.length - 1;
        emit CandidateRegistered(candidateId, _name, _party, _constituency);
    }

    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 _id) external view returns (
        string memory name,
        string memory party,
        string memory symbol,
        string memory constituency,
        bool isApproved
    ) {
        require(_id < candidates.length, "Invalid candidate ID");
        Candidate memory c = candidates[_id];
        return (c.name, c.party, c.symbol, c.constituency, c.isApproved);
    }

    function isElectionActive() external view returns (bool) {
        return currentElection.status == ElectionStatus.Active &&
               block.timestamp >= currentElection.startDate &&
               block.timestamp <= currentElection.endDate;
    }
}
