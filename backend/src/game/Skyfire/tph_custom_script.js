// See if Metamask is installed in the browser
web3 = "";
/* Moralis init code */


async function moralisLogOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

let subscription;
async function moralisLogin() {
	const serverUrl = "https://ecwergzc0upy.usemoralis.com:2053/server";
const appId = "aSQqwVAKRqeHqz3FVcMwLCuPjL2avMKX4DFnj2vD";
Moralis.start({ serverUrl, appId });
  let user = Moralis.User.current();
	var map = {};
	map["id"] = "moralisLogin";
	map["user"] = "0";
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
      });
		map["user"] = user;
		}
		let query = new Moralis.Query('Split');
    subscription = await query.subscribe();
		subscription.on('create', (object) => {
			moralisSetSplit(object);
		});
		GMS_API.send_async_event_social(map);
	}

	
async function moralisSetSplit(object) {
	console.log('object created', object);
	var map = {};
	map["id"] = "moralisSetSplit";
	GMS_API.send_async_event_social(map);
}

function checkMetaConnection() {
	if (typeof window.ethereum !== 'undefined') {
		return 1;
	} else {
		return 0;
	}
}

// Ask user to connect wallet to site and get address
async function getMetamaskAccount() {
	var map = {};
	map["id"] = "getWalletAddress";
	map["address"]="0";

	try {
	  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		map["address"] = accounts[0];
		web3 = new Web3(window.ethereum);
		console.log(web3);
		console.log(map["address"]);

	} catch(error) {
		console.log("User rejected request");
	}
	GMS_API.send_async_event_social(map);
}


async function getTokenBalance(wallet_address, token_address) {

	// Default structure of ERC20 smart contract
	let minABI = [
	  // balanceOf
	  {
	    "constant":true,
	    "inputs":[{"name":"_owner","type":"address"}],
	    "name":"balanceOf",
	    "outputs":[{"name":"balance","type":"uint256"}],
	    "type":"function"
	  },
	  // decimals
	  {
	    "constant":true,
	    "inputs":[],
	    "name":"decimals",
	    "outputs":[{"name":"","type":"uint8"}],
	    "type":"function"
	  }
	];

	var map = {};
	map["id"] = "getTokenBalance";
	map["balance"]="-1";

	let contract = new web3.eth.Contract(minABI, token_address);
	console.log(contract);

	try {

		const balance = await contract.methods.balanceOf(wallet_address).call();
		const decimalPlaces = await contract.methods.decimals().call(); // 8
		let newBalance = 0;
		
		if (decimalPlaces) {
			newBalance = balance / (10 ** decimalPlaces);
		}

		console.log(balance);
		console.log(decimalPlaces);
		console.log(newBalance);

		map["balance"] = newBalance;

	} catch(error) {
		console.log(error);
	}

	GMS_API.send_async_event_social(map);
}

async function postClaimForTokens(wallet_address, epoch_index, epoch, proof, amount) {

	// Default structure of ERC20 smart contract
	let minABI = [{"inputs":[{"internalType":"address","name":"token_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"_epoch","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"_epoch","type":"uint256"}],"name":"isClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"merkleRootInEpoch","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"},{"internalType":"uint256","name":"_epoch","type":"uint256"}],"name":"setMerkleRootPerEpoch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

	var map = {};
	map["id"] = "postClaimForTokens";

	let contract = new web3.eth.Contract(minABI, "0x47455f503Ee95A2E1E800b4fE5199604499f3316");
	console.log(contract);

	try {

    await contract.methods.claim(epoch_index, wallet_address, amount.toString(), proof, epoch).send({
			from:wallet_address
		});

	} catch(error) {
		console.log(error);
	}

	GMS_API.send_async_event_social(map);
}




async function approveLINK(wallet_address) {

	// Hardcoded for now
	let minABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

	let amount = 1000000000000000000;

	let contract = new web3.eth.Contract(minABI, "0x326C977E6efc84E512bB9C30f76E30c160eD06FB");
	console.log(contract);
	try {
    await contract.methods.approve("0x5EB1303916F2a56455f563B5a5b3Fa33b3Ed498E", amount.toString()).send({
			from:wallet_address
		});

	} catch(error) {
		console.log(error);
	}
}

async function splitChyme(wallet_address) {

	// Hardcoded for now
	let minABI = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "source", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "mergedAmount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "Merge", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "source", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "splitAmount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "Split", "type": "event" }, { "inputs": [], "name": "Chyme", "outputs": [ { "internalType": "contract ICHYME", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "elixir", "outputs": [ { "internalType": "contract IERC20Burnable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_Chyme", "type": "address" }, { "internalType": "address", "name": "_Steady", "type": "address" }, { "internalType": "address", "name": "_Elixir", "type": "address" }, { "internalType": "address", "name": "_priceOracle", "type": "address" } ], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ChymeAmountToMerge", "type": "uint256" } ], "name": "merge", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "priceFromOracle", "outputs": [ { "internalType": "int256", "name": "price", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "priceOracle", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "split", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "steady", "outputs": [ { "internalType": "contract IERC20Burnable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ];

	let amount = 1000000000000000000;
	// let amount = 10;

	let contract = new web3.eth.Contract(minABI, "0x5eb1303916f2a56455f563b5a5b3fa33b3ed498e");
	console.log(contract);
	try {
    await contract.methods.split(amount.toString()).send({
			from:wallet_address
		});

	} catch(error) {
		console.log(error);
	}
}















//
