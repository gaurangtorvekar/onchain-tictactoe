import React from "react";
import { useState, useEffect } from "react";
import { Container, NavDropdown, Nav, Navbar } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import truncateEthAddress from "truncate-eth-address";
import { ToastContainer, toast } from "react-toastify";

export function NavBarConnect() {
	const { active, account, library, connector, activate, deactivate } = useWeb3React();

	const connectWallet = async () => {
		try {
			const injected = await new InjectedConnector({
				supportedChainIds: [534354],
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
				<Navbar.Brand href="#home">On-chain Tic Tac Toe</Navbar.Brand>
				<Nav className="justify-content-end">
					<Nav.Link href="https://github.com/gaurangtorvekar/onchain-tictactoe" target="_blank">
						Github
					</Nav.Link>
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
