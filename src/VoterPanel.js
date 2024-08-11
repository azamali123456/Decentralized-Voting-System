import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Voting from "./Voting.json";
import { ToastContainer, toast } from 'react-toastify';
const VoterPanel = () => {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votingContract, setVotingContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [votedAccounts, setVotedAccounts] = useState([]);
  const [notVotedAccounts, setNotVotedAccounts] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3("http://127.0.0.1:7545");
  
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        setAccount(accounts[selectedAccountIndex]);
  
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        const contract = new web3.eth.Contract(Voting.abi, deployedNetwork && deployedNetwork.address);
        setVotingContract(contract);
  
        // Fetch candidates
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidatesList = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contract.methods.candidates(i).call();
          candidatesList.push(candidate);
        }
        setCandidates(candidatesList);
  
        // Fetch voted and unvoted accounts
        const votersStatus = await contract.methods.getVotersStatus().call();
        console.log(votersStatus,"votersStatus")

        setVotedAccounts(votersStatus[0]);
        setNotVotedAccounts(votersStatus[1]);
  
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
  
    init();
  }, [selectedAccountIndex]);
  

  const vote = async (candidateId) => {
    try {
      const accountToUse = accounts[selectedAccountIndex];
      await votingContract.methods.vote(candidateId).send({ 
        from: accountToUse,
        gas: 200000 // Specify a higher gas limit here
      });
      toast.success(`Vote cast successfully from account: ${accountToUse}`)
      const votersStatus = await votingContract.methods.getVotersStatus().call();
      console.log(votersStatus,"votersStatus")
      setVotedAccounts(votersStatus[0]);
     
      setNotVotedAccounts(votersStatus[1]);
    } catch (error) {
      console.error("Error voting:", error);
      toast.success(`${error.message}`)
    }
  };
  
 console.log(votedAccounts,"votedAccounts")
  return (
    <div>
      <h1>Decentralized Voting</h1>
      <p>Selected Account: {accounts[selectedAccountIndex]}</p>

      <div>
        <label>Select Account: </label>
        <select
          value={selectedAccountIndex}
          onChange={(e) => setSelectedAccountIndex(e.target.value)}
        >
          {accounts.map((acc, index) => (
            <option key={acc} value={index}>
              {acc}
            </option>
          ))}
        </select>
      </div>

      <h2>Candidates</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - {candidate.voteCount} votes
            <button onClick={() => vote(candidate.id)}>Vote</button>
          </li>
        ))}
      </ul>

      <h2>Voted Accounts</h2>
      <ul>
        {votedAccounts.map((voter, index) => (
          <li key={index}>{voter}</li>
        ))}
      </ul>

      <h2>Not Voted Accounts</h2>
      <ul>
        {notVotedAccounts.map((voter, index) => (
          <li key={index}>{voter}</li>
        ))}
      </ul>
      <ToastContainer />
    </div>

  );
};

export default VoterPanel;
