var express = require("express");
var bodyParser = require("body-parser");
var Web3 = require("web3");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000;
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  next();
});

var abi = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }  
];

var token = "0x6Ad0F087501Eee603AeDa0407c52864bc7f83322";
var deads = "0x000000000000000000000000000000000000dead";

//https://bscrpc.com
//https://bsc.publicnode.com
var web3 = new Web3("https://bscrpc.com");

var contract = new web3.eth.Contract(abi, token);

app.get("/totalcoins", async (req, res, next) => {
	try {
		let totals = await contract.methods.totalSupply().call();
		let decimal = await contract.methods.decimals().call();
		
		let result = totals / Math.pow(10, decimal);
		
		res.json(result);
	} 
	catch (e) {
		return res.status(401).send({
			message : e.message
		});
	}
});

app.get("/circulation", async (req, res, next) => {
	try {
		let totals = await contract.methods.totalSupply().call();
		let decimal = await contract.methods.decimals().call();
		let balance = await contract.methods.balanceOf(deads).call();
		
		let totalSupply = totals / Math.pow(10, decimal);
		let deadAddress = balance / Math.pow(10, decimal);
		let circulation = totalSupply - deadAddress;

		res.json(circulation);
	} 
	catch (e) {
		return res.status(401).send({
			message : e.message
		});
	}
});

app.get("/", (req, res, next) => {
    res.json({"status":"running"})
});

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
});
