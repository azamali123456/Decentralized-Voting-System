const Voting = artifacts.require("Voting");

module.exports = async function(deployer, network, accounts) {
  // Define the list of eligible voters
  const eligibleVoters = accounts;;

  // Deploy the contract with the eligible voters list
  await deployer.deploy(Voting, eligibleVoters);
};
