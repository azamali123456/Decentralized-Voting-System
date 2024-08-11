// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    address[] public allVoters;
    address[] public eligibleVoters;

    event votedEvent(uint indexed _candidateId);

    constructor(address[] memory _eligibleVoters) {
        eligibleVoters = _eligibleVoters;

        // Add candidates
        addCandidate("Imran Khan");
        addCandidate("Nawaz Sharif");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "Already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);

        allVoters.push(msg.sender);  // Track all voters who have voted
    }

    function getVotersStatus() public view returns (address[] memory, address[] memory) {
        uint votedCount = 0;
        uint notVotedCount = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            if (voters[eligibleVoters[i]]) {
                votedCount++;
            } else {
                notVotedCount++;
            }
        }

        address[] memory voted = new address[](votedCount);
        address[] memory notVoted = new address[](notVotedCount);

        votedCount = 0;
        notVotedCount = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            if (voters[eligibleVoters[i]]) {
                voted[votedCount] = eligibleVoters[i];
                votedCount++;
            } else {
                notVoted[notVotedCount] = eligibleVoters[i];
                notVotedCount++;
            }
        }

        return (voted, notVoted);
    }
}
