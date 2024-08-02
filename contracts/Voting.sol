// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Contestant {
        uint id;
        string name;
        uint voteCount;
        string party;
        uint age;
        string qualification;
    }

    struct Voter {
        bool hasVoted;
        uint vote;
        bool isRegistered;
        string name;
    }

    address public admin;
    mapping(uint => Contestant) public contestants;
    mapping(address => Voter) public voters;
    uint public contestantsCount;

    enum PHASE { reg, voting, done }
    PHASE public state;

    event ContestantAdded(uint id, string name, string party, uint age, string qualification);
    event VoterRegistered(address voter, string name);
    event Voted(address voter, uint contestantId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier validState(PHASE x) {
        require(state == x, "Invalid state for this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        state = PHASE.reg;
    }

    function changeState(PHASE x) public onlyAdmin {
        require(x > state, "Cannot revert to previous state");
        state = x;
    }

    function addContestant(string memory _name, string memory _party, uint _age, string memory _qualification) public onlyAdmin validState(PHASE.reg) {
        contestantsCount++;
        contestants[contestantsCount] = Contestant(contestantsCount, _name, 0, _party, _age, _qualification);
        emit ContestantAdded(contestantsCount, _name, _party, _age, _qualification);
    }

    function registerVoter(address user, string memory _name) public onlyAdmin validState(PHASE.reg) {
        require(!voters[user].isRegistered, "Voter already registered");
        voters[user] = Voter(false, 0, true, _name);
        emit VoterRegistered(user, _name);
    }

    function vote(uint _contestantId) public validState(PHASE.voting) {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_contestantId > 0 && _contestantId <= contestantsCount, "Invalid contestant ID");
        
        contestants[_contestantId].voteCount++;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].vote = _contestantId;
        emit Voted(msg.sender, _contestantId);
    }

    function getContestant(uint _id) public view returns (string memory name, uint voteCount, string memory party, uint age, string memory qualification) {
        require(_id > 0 && _id <= contestantsCount, "Invalid contestant ID");
        Contestant memory contestant = contestants[_id];
        return (contestant.name, contestant.voteCount, contestant.party, contestant.age, contestant.qualification);
    }

    function getAllContestants() public view returns (Contestant[] memory) {
        Contestant[] memory allContestants = new Contestant[](contestantsCount);
        for (uint i = 1; i <= contestantsCount; i++) {
            allContestants[i - 1] = contestants[i];
        }
        return allContestants;
    }

    function getVoterName(address _voter) public view returns (string memory) {
        return voters[_voter].name;
    }

    function getVoterStatus(address _voter) public view returns (bool hasVoted, uint voteId, bool isRegistered) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.vote, voter.isRegistered);
    }

    function getVotingStatus() public view returns (PHASE) {
        return state;
    }
}
