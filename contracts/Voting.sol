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
    mapping(address => string) public voterNames; // Map address to names
    uint public candidatesCount;
    uint public votingEndTime; // Store voting end time
    address[] public allVoters;
    address[] public eligibleVoters;

    event votedEvent(uint indexed _candidateId);

    constructor(address[] memory _eligibleVoters, string[] memory _voterNames, uint _votingDurationMinutes) {
        require(_eligibleVoters.length == _voterNames.length, "Voter addresses and names must match in length.");

        eligibleVoters = _eligibleVoters;

        for (uint i = 0; i < _eligibleVoters.length; i++) {
            voterNames[_eligibleVoters[i]] = _voterNames[i];
        }

        // Set voting end time
        votingEndTime = block.timestamp + (_votingDurationMinutes * 1 minutes);

        // Add candidates
        addCandidate("Google");
        addCandidate("Facebook");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(block.timestamp < votingEndTime, "Voting period has ended.");
        require(!voters[msg.sender], "Already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);

        allVoters.push(msg.sender);  // Track all voters who have voted
    }

    function getVotersStatus() public view returns (string[] memory, string[] memory) {
        uint votedCount = 0;
        uint notVotedCount = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            if (voters[eligibleVoters[i]]) {
                votedCount++;
            } else {
                notVotedCount++;
            }
        }

        string[] memory voted = new string[](votedCount);
        string[] memory notVoted = new string[](notVotedCount);

        votedCount = 0;
        notVotedCount = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            if (voters[eligibleVoters[i]]) {
                voted[votedCount] = voterNames[eligibleVoters[i]];
                votedCount++;
            } else {
                notVoted[notVotedCount] = voterNames[eligibleVoters[i]];
                notVotedCount++;
            }
        }

        return (voted, notVoted);
    }
}
