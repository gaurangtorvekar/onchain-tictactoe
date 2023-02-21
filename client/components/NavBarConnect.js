import React from "react";
import { useState, useEffect } from "react";
import { Container, NavDropdown, Nav, Navbar } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import truncateEthAddress from "truncate-eth-address";

export function NavBarConnect() {
	//This handles chain changes or account changes on Metamask
	try {
		const { ethereum } = window;
		ethereum.on("chainChanged", async () => {
			let chainId = await ethereum.request({ method: "eth_chainId" });
			const mumbaiChainId = "0x13881";

			if (chainId !== mumbaiChainId) {
				//TODO - Use toast here
				alert("You are not connected to Mumbai Testnet");
				return;
			}
		});
	} catch (e) {
		// console.log("Error while handling Metamask account or chain changed", e);
	}

	const { active, account, library, connector, activate, deactivate } = useWeb3React();

	const connectWallet = async () => {
		try {
			const injected = await new InjectedConnector({
				supportedChainIds: [1, 3, 4, 5, 42, 80001],
			});
			await activate(injected);
		} catch (e) {
			console.log("Error connecting to metamask", e);
		}
	};
	const disconnectWallet = async () => {
		try {
			await deactivate();
		} catch (e) {
			console.log("Error while disconnecting metamask");
		}
	};

	return (
		<Navbar bg="light" fixed="top">
			<Container>
				<Navbar.Brand href="#home">Navbar</Navbar.Brand>
				<Nav className="justify-content-end">
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#features">Features</Nav.Link>
					<Nav.Link href="#pricing">Pricing</Nav.Link>
					{account ? (
						<NavDropdown id="nav-dropdown-dark-example" title={truncateEthAddress(account)}>
							<NavDropdown.Item href="#action/3.1" onClick={disconnectWallet}>
								Disconnect
							</NavDropdown.Item>
						</NavDropdown>
					) : (
						<Nav.Item as="button" className="btn btn-primary btn-sm" onClick={connectWallet}>
							Connect Wallet
						</Nav.Item>
					)}
				</Nav>
			</Container>
		</Navbar>
	);
}
