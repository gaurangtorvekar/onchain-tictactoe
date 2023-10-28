const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

/* global ethers task */
require("@nomicfoundation/hardhat-toolbox");

const keys = process.env.WALLET;
const scrollUrl = "https://alpha-rpc.scroll.io/l2";

module.exports = {
	solidity: "0.8.19",
	hardhat: {
		allowUnlimitedContractSize: true,
	},

	etherscan: {
		apiKey: {
			polygonMumbai: process.env.MUMBAI_KEY,
			scroll: process.env.ETHERSCAN,
			scroll_sepolia: "abc",
			arbitrumGoerli: process.env.ARBISCAN,
			// arbg: process.env.ARBISCAN,
			scrollMainnet: process.env.SCROLLSCAN,
		},
		customChains: [
			{
				network: "scroll",
				chainId: 534353,
				urls: {
					apiURL: "https://blockscout.scroll.io/api",
					browserURL: "https://blockscout.scroll.io",
				},
			},
			{
				network: "scrollMainnet",
				chainId: 534352,
				urls: {
					apiURL: "https://api.scrollscan.com/api",
					browserURL: "https://scrollscan.com/",
				},
			},
			{
				network: "scroll_sepolia",
				chainId: 534351,
				urls: {
					apiURL: "https://sepolia-blockscout.scroll.io/api",
					browserURL: "https://sepolia-blockscout.scroll.io/",
				},
			},
			{
				network: "arbitrumGoerli",
				chainId: 421613,
				urls: {
					apiURL: "https://api-goerli.arbiscan.io/api",
					browserURL: "https://goerli.arbiscan.io/",
				},
			},

			{
				network: "polygonMumbai",
				chainId: 80001,
				urls: {
					apiURL: "https://api-testnet.polygonscan.com/api",
					browserURL: "https://mumbai.polygonscan.com/",
				},
			},
		],
	},
	networks: {
		scroll_alpha: {
			url: scrollUrl,
			accounts: [keys],
		},

		scroll: {
			gasLimit: 400000000,
			gasPrice: 400000000,
			url: "https://rpc.scroll.io ",
			accounts: [keys],
		},

		mumbai: {
			allowUnlimitedContractSize: true,
			gas: 2100000,
			gasPrice: 8000000000,
			gasLimit: 50000000000000,
			url: process.env.MUMBAI_RPC,
			accounts: [keys],
		},
		scrollMainnet: {
			url: "https://rpc.scroll.io",
			accounts: [keys],
		},
		arbg: {
			url: "https://arbitrum-goerli.blockpi.network/v1/rpc/public",
			accounts: [keys],
		},
	},
	settings: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	},
};

