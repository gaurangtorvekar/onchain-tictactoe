require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_MUMBAI_URL = process.env.ALCHEMY_MUMBAI_URL;
const ACCOUNT_KEY = process.env.ACCOUNT_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {
		mumbai: {
			url: ALCHEMY_MUMBAI_URL,
			accounts: [ACCOUNT_KEY],
		},
	},
	etherscan: {
		apiKey: process.env.POLY_API_KEY,
	},
};
