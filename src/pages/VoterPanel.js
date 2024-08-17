import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './index.css';
import Voting from '../Voting.json';
import { ToastContainer, toast } from 'react-toastify';
import Card from '../components/Card';
import Cadidate from '../components/CadidateCard';
import image1 from '../assets/images/google.png';
import image2 from '../assets/images/facebook.png';

const CountdownClock = () => {
  const images = [image1, image2];
  const [account, setAccount] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votingContract, setVotingContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [votedAccounts, setVotedAccounts] = useState([]);
  const [notVotedAccounts, setNotVotedAccounts] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // Time in seconds
  const [name, setName] = useState('');
  const [userExist, setUserExist] = useState(false);
  const [userId, setUserId] = useState();
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3('http://127.0.0.1:7545');

        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        setAccount(accounts[selectedAccountIndex]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        const contract = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork && deployedNetwork.address
        );
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
        setVotedAccounts(votersStatus[0]);
        setNotVotedAccounts(votersStatus[1]);

        // Fetch voting end time and start countdown
        const votingEndTime = await contract.methods.votingEndTime().call();
        const currentTime = Math.floor(Date.now() / 1000);
        const regularNumber = Number(votingEndTime);
        setTimeRemaining(regularNumber - currentTime);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    init();
  }, [1000]);

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    console.log(seconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    console.log(`${hours}h ${minutes}m ${secs}s`);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const vote = async (candidateId) => {
    try {
      // const accountToUse = accounts[selectedAccountIndex];
      const votingEndTime = await votingContract.methods.votingEndTime().call();
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > votingEndTime) {
        toast.error('Voting period has ended.');
        return;
      }
      await votingContract.methods.vote(candidateId).send({
        from: userId,
        gas: 200000,
      });

      toast.success(`Vote cast successfully from account: ${userId}`);

      const votersStatus = await votingContract.methods
        .getVotersStatus()
        .call();
      setVotedAccounts(votersStatus[0]);
      setNotVotedAccounts(votersStatus[1]);

      const candidatesCount = await votingContract.methods.candidatesCount().call();
      const candidatesList = [];
      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await votingContract.methods.candidates(i).call();
        candidatesList.push(candidate);
      }
      setCandidates(candidatesList);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('You already voted');
    }
  };

  const checkUser = () => {
    console.log(notVotedAccounts, name, 'user');
    if (name !== '') {
      const userExists =
        notVotedAccounts.find((user) => user === name) !== undefined;
      if (userExists) {
        toast.success('You can cast your vote');
        setUserExist(userExists);
        const userIndex = notVotedAccounts.findIndex((user) => user === name);
        setUserId(accounts[userIndex]);
      } else {
        toast.error(
          'User not exist.Please Copy/Paste one user from above list'
        );
      }
    }
  };

  return (
    <div>
      {/* Top Cards */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          initial={true}
          title='Google Vs Facebook'
        />
        <Card
          title='Total Voter'
          count={accounts.length}
        />

        <Card
          title='Voted'
          count={votedAccounts.length}
        />
        <Card
          title='Un-Voted'
          count={notVotedAccounts.length}
        />
        <span className='time'>
          <h2>Time Remaining</h2>
          <p>{formatTime(timeRemaining)}</p>
        </span>
      </div>

      {userExist ? (
        <>
          {/* <h1>Decentralized Voting</h1>
          <p>Selected Account: {accounts[selectedAccountIndex]}</p>
          <div>
            <label>Select Account: </label>
            <select
              value={selectedAccountIndex}
              onChange={(e) => setSelectedAccountIndex(e.target.value)}
            >
              {accounts.map((acc, index) => (
                <option
                  key={acc}
                  value={index}
                >
                  {acc}
                </option>
              ))}
            </select>
          </div> */}

          <h2>Candidates</h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {candidates.map((candidate, index) => (
              <>
                <Cadidate
                  candidate={candidate}
                  image={images[index]}
                />
                <br/>
                <span className='vote-button' onClick={() => vote(candidate.id)}>Vote</span>
              </>
            ))}
          </div>
          <h2>Voted Accounts</h2>
          
            {votedAccounts.map((voter, index) => (
              <span className='casted-voter' key={index}>{voter}</span>
            ))}
          

          <h2>Not Voted Accounts</h2>
            {notVotedAccounts.map((voter, index) => (
              <span className='casted-voter' key={index}>{voter}</span>
            ))}
          
        </>
      ) : (
        <>
          <span className='test-name-div'>
            {notVotedAccounts.map((voter, index) => (
              <p
                className='test-name'
                key={index}
              >
                {voter}
              </p>
            ))}
          </span>
          <input
            type='text'
            placeholder='Enter Your Name'
            className='input-field'
            onChange={(e) => setName(e.target.value)}
          />
          <button
            disabled={name ? false : true}
            className='button'
            onClick={() => {
              checkUser(name);
            }}
          >
            {' '}
            Submit
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default CountdownClock;
