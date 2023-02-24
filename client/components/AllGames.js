import React from "react";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";
import { tictactoe_abi, tictactoe_bytecode, registry_abi, registry_address } from "../lib/contract_config";
import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { useWeb3React } from "@web3-react/core";

export function AllGames({ selectedGameFunc }) {
	const [games, setGames] = useState([]);
	const [selectedGame, setSelectedGame] = useState(null);
	const { account } = useWeb3React();

	const findGames = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				let registry_contract = new ethers.Contract(registry_address, registry_abi, signer);
				if (account) {
					let tx = await registry_contract.getGameList(account);
					setGames(tx);
				}
			}
		} catch (e) {
			console.log("Error while finding games", e);
		}
	};

	const resetGame = async (event) => {
		const selectedGameContract = event.target.dataset.id;
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				let gameContractObj = new ethers.Contract(selectedGameContract, tictactoe_abi, signer);
				if (account) {
					let tx = await gameContractObj.newGame();
				}
			}
		} catch (e) {
			console.log("Error while resetting game", e);
		}
	};

	const setGame = async (event) => {
		const selectedGameContract = event.target.dataset.id;
		let gameBoardState;
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				let gameContractObj = new ethers.Contract(selectedGameContract, tictactoe_abi, signer);
				if (account) {
					let tx = await gameContractObj.getGame();

					gameBoardState = tx.toString();
				}
			}
		} catch (e) {
			console.log("Error while finding games", e);
		}
		const gameObject = {
			gameContract: event.target.dataset.id,
			gameBoard: gameBoardState,
		};
		selectedGameFunc(gameObject);
	};

	useEffect(() => {
		findGames();
	}, [account]);
	return (
		<>
			<h3>Your on-chain games</h3>
			{games.length > 0 ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>First Player</th>
							<th>Second Player</th>
							<th>Game Contract</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{games.map((item, index) => (
							<tr key={index}>
								<td>{index}</td>
								<td>{truncateEthAddress(item[0])}</td>
								<td>{truncateEthAddress(item[1])}</td>
								<td>{truncateEthAddress(item[2])}</td>
								<td>
									<Button variant="outline-primary" size="sm" data-id={item[2]} onClick={setGame} type="submit">
										Choose
									</Button>
								</td>
								<td>
									<Button variant="outline-primary" size="sm" data-id={item[2]} onClick={resetGame} type="submit">
										Reset
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<p>Oops! You haven't created any games yet. Please create a new game.</p>
			)}
		</>
	);
}
