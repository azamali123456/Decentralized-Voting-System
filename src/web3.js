// import Web3 from 'web3';
// import VotingContract from './Voting.json'; // Adjust path as per your project structure

// const web3 = new Web3('http://localhost:7545'); // Connect to Ganache or your local Ethereum node
// const contractAddress = '0x09f3C31a6b4e4D1274015ec8840B1620d2B3Ce16'; // Replace with your deployed contract address
// const instance = new web3.eth.Contract(VotingContract.abi, contractAddress);

// // Example function call
// // instance.methods.getAllCandidates().call((error, result) => {
// //   if (error) {
// //     console.error('Error calling getAllCandidates:', error);
// //   } else {
// //     console.log('getAllCandidates result:', result);
// //   }
// // });

// export default web3;

import Web3 from 'web3';
import VotingContract from './Voting.json'; // Adjust path as per your project structure

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const getContractInstance = async () => {
  try {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = VotingContract.networks[networkId];
    
    if (!deployedNetwork) {
      throw new Error('Contract not deployed on the current network.');
    }

    const contractAddress = deployedNetwork.address;
    const instance = new web3.eth.Contract(VotingContract.abi, contractAddress);
    
    return instance;
  } catch (error) {
    console.error('Error getting contract instance:', error);
    return null;
  }
};

export { web3, getContractInstance };

