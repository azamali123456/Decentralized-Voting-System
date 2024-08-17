const Voting = artifacts.require("Voting");

module.exports = async function(deployer, network, accounts) {
  // Define the list of eligible voters (using available accounts)
  const eligibleVoters = accounts;

  // Define the list of voter names corresponding to the eligible voters
  const voterNames = [
    "Ali",
    "Azam",
    "Noman",
    "Hfiz Ali",
    "Imran Afzal",
    "Kmaran Ali",
    "Rameez Khan",
    "Qasim Ali",
    "Kamran Sahi",
    "Azam Ali",
  ];

  // Define the voting duration (in minutes)
  const votingDurationMinutes = 60; // Example: 60 minutes

  // Deploy the contract with the eligible voters, voter names, and voting duration
  await deployer.deploy(Voting, eligibleVoters, voterNames, votingDurationMinutes);
};
