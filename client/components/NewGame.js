import React from "react";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";
import { tictactoe_abi, tictactoe_bytecode, registry_abi, registry_address } from "../lib/contract_config";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

export function NewGame() {
	const { account } = useWeb3React();
	const createNewGame = async (event) => {
		try {
			const data = {
				firstPlayer: event.target.firstPlayer.value,
				secondPlayer: event.target.secondPlayer.value,
			};
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const secondPlayer = data.secondPlayer ? data.secondPlayer : "0xC26880A0AF2EA0c7E8130e6EC47Af756465452E8";

				// First check if a game already exists for these two players
				let newGame = true;
				let registry_contract = new ethers.Contract(registry_address, registry_abi, signer);
				const games = await registry_contract.getGameList(account);
				games.map((game) => {
					if (game.firstPlayer == account && game.secondPlayer == secondPlayer) newGame = false;
				});

				if (newGame) {
					let factory = new ethers.ContractFactory(tictactoe_abi, tictactoe_bytecode, signer);
					let contract = await factory.deploy(secondPlayer);
					let tx = await registry_contract.register(account, secondPlayer, contract.address);
				}
			} else {
				console.log("Cannot find Eth object");
			}
		} catch (e) {
			console.log("Error while deploying the contract", e);
		}
	};

	return (
		<>
			<Form onSubmit={createNewGame}>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="formGridCity">
						<Form.Label>First Player</Form.Label>
						<Form.Control name="firstPlayer" disabled value={account ? `${account} (YOU)` : "0x"} />
					</Form.Group>

					<Form.Group as={Col} controlId="formGridState">
						<Form.Label>Second Player</Form.Label>
						<Form.Control name="secondPlayer" placeholder="0x" />
					</Form.Group>
				</Row>
				<Button variant="primary" type="submit">
					Start New Game
				</Button>
			</Form>
		</>
	);
}
