import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingABI from './Voting.json'; // Adjust the path if necessary

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

const VoterPanel = () => {
  const [contract, setContract] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [selectedContestant, setSelectedContestant] = useState('');
  const [votingStatus, setVotingStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContract = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);
        const networkData = VotingABI.networks[networkId];
        if (!networkData) {
          throw new Error('Smart contract is not deployed to the detected network.');
        }
        const contractInstance = new web3.eth.Contract(VotingABI.abi, networkData.address);
        setContract(contractInstance);
        await loadContractData(contractInstance);
      } catch (err) {
        setError(err.message);
        console.error('Error loading contract:', err);
      }
    };

    loadContract();
  }, []);

  const loadContractData = async (contractInstance) => {
    try {
      // Fetch the number of contestants
      const contestantsCount = await contractInstance.methods.contestantsCount().call();
      console.log('Contestants Count:', contestantsCount);

      // Fetch all contestants
      const contestantsList = [];
      for (let i = 1; i <= parseInt(contestantsCount, 10); i++) {
        const contestant = await contractInstance.methods.contestants(i).call();
        console.log('Contestant:', contestant);
        contestantsList.push({
          id: contestant.id,
          name: contestant.name,
          voteCount: parseInt(contestant.voteCount, 10),
          party: contestant.party,
          age: parseInt(contestant.age, 10),
          qualification: contestant.qualification,
        });
      }

      // Fetch the voting state
      const state = await contractInstance.methods.state().call();
      console.log('Voting State:', state);

      setContestants(contestantsList);
      setVotingStatus(['Registration', 'Voting', 'Done'][parseInt(state, 10)]);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contract data:', err);
    }
  };

  const handleVote = async () => {
    if (!selectedContestant) {
      setError('Please select a contestant.');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.vote(selectedContestant).send({ from: accounts[0] });
      await loadContractData(contract); // Reload data after voting
    } catch (err) {
      setError(err.message);
      console.error('Error casting vote:', err);
    }
  };

  const handleRegister = async (address, name) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerVoter(address, name).send({ from: accounts[0] });
      await loadContractData(contract); // Reload data after registration
    } catch (err) {
      setError(err.message);
      console.error('Error registering voter:', err);
    }
  };

  return (
    <div>
      <h2>Voter Panel</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h3>Voting Status: {votingStatus}</h3>

      {votingStatus === 'Voting' && (
        <div>
          <select onChange={(e) => setSelectedContestant(e.target.value)}>
            <option value="">Select Contestant</option>
            {contestants.map((contestant) => (
              <option key={contestant.id} value={contestant.id}>
                {contestant.name} ({contestant.party})
              </option>
            ))}
          </select>
          <button onClick={handleVote}>Vote</button>
        </div>
      )}

      <h3>Contestants:</h3>
      <ul>
        {contestants.map((contestant) => (
          <li key={contestant.id}>
            {contestant.name} ({contestant.party}) - {contestant.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoterPanel;
