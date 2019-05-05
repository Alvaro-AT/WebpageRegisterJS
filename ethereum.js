require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, process.env.WEB3_PROVIDER_ADDRESS));
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACT_ADDRESS;
const contract = web3.eth.contract(abi).at(address);

const account = () => {
  	return new Promise((resolve, reject) => {
    	web3.eth.getAccounts((err, accounts) => {
      		if (err === null) {
        		resolve(accounts[0]);
      		} else {
        		reject(err);
      		}
    	});
  	});
};

const RequestWebpageURL = ( url, option ) => {
  	return new Promise((resolve, reject) => {
    	account().then(account => {
      		contract.RegisterWebpageURL(url, option, { from: account }, (err, res) => {
          		if (err === null) {
            		resolve(res);
          		} else {
            		reject(err);
          		}
        	});
    	}).catch(error => reject(error));
  	});
};

const RegisterWebpageMetadata = ({ timestamp, url, content }) => {
  	return new Promise((resolve, reject) => {
    	account().then(account => {
      		contract.RegisterWebpageMetadata(timestamp, url, content, { from: account }, (err, res) => {
          		if (err === null) {
            		resolve(res);
          		} else {
            		reject(err);
          		}
        	});
    	}).catch(error => reject(error));
  	});
};

const checkBlocks = () => {
  	let registry = contract.WebpageRegistration({}, {fromBlock: 0, toBlock: 'latest'});
  	console.log("\n");
  	console.log("  REGISTRO DE EVENTOS  ")
  	registry.get((error, logs) => {
    	logs.forEach(log => console.log(log.args))
  	});
};

const requestWebpage = (callback) => {
  	contract.WebpageRequest((error, result) => callback(error, result));
};

const registerWebpageData = (callback) => {
  	contract.WebpageRegistration((error, result) => callback(error, result));
};

module.exports = {RequestWebpageURL, RegisterWebpageMetadata, checkBlocks, requestWebpage, registerWebpageData};