import React, { useState, useEffect } from "react";
import { Square } from "./Square";
import { NewGame } from "./NewGame";
import { NavBarConnect } from "./NavBarConnect";
import { AllGames } from "./AllGames";
import { HowTo } from "./HowTo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { useEagerConnect } from "@/utils/useEagerConnect";
import { useWeb3React } from "@web3-react/core";
import { tictactoe_abi } from "@/lib/contract_config";
import { decodeBitwise } from "@/utils/decodeBitwise";
import { ethers } from "ethers";

export default function Board() {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [xIsNext, setXIsNext] = useState(true);
	const [selectedGame, setSelectedGame] = useState(null);
	const [gameWinner, setGameWinner] = useState();
	useEagerConnect();
	const { account } = useWeb3React();

	//This function sets a game from the AllGames component
	const selectedGameFunc = (game) => {
		setSelectedGame(game);
	};

	const setBoard = () => {
		const squaresClone = squares.slice();
		console.log("In board.js = ", gameObject.gameBoard);
		gameObject.gameBoard.map((item, index) => {
			if (item == "X") {
				squaresClone[index] = "X";
			} else if (item == "O") {
				squaresClone[index] = "O";
			} else {
				squaresClone[index] = null;
			}
		});
		setSquares(squaresClone);

		if (gameObject.gameTurn == "X") {
			setXIsNext(true);
		} else {
			setXIsNext(false);
		}
	};

	const handleClick = async (i) => {
		if (!selectedGame) {
			toast.warning("You need to choose an account and select a game first!", {
				position: toast.POSITION.TOP_RIGHT,
			});
			return;
		}
		const squaresClone = squares.slice();
		if (squares[i] !== null) {
			return;
		}

		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				console.log("Got the signer = ", signer);
				let gameContractObj = new ethers.Contract(selectedGame.gameContract, tictactoe_abi, signer);
				if (account) {
					let players = await gameContractObj.getPlayers();
					console.log("Players = ", players);
					if (account == players[0] || account == players[1]) {
						switch (gameObject.gameTurn) {
							case "X":
								if (account == players[0]) {
									if (!winner) {
										squaresClone[i] = xIsNext ? "X" : "O";
										setSquares(squaresClone);
										setXIsNext(!xIsNext);
									} else {
										toast.warning("Game is over!", {
											position: toast.POSITION.TOP_RIGHT,
										});
									}
									let result = await gameContractObj.move(i);
									console.log("Not a game player");
									console.log("After the move = ", result);
								} else {
									toast.warning("Wait for your turn!", {
										position: toast.POSITION.TOP_RIGHT,
									});
									return;
								}
								break;
							case "O":
								if (account == players[1]) {
									if (!winner) {
										squaresClone[i] = xIsNext ? "X" : "O";
										setSquares(squaresClone);
										setXIsNext(!xIsNext);
									} else {
										toast.warning("Game is over!", {
											position: toast.POSITION.TOP_RIGHT,
										});
									}
									let result = await gameContractObj.move(i);
									console.log("After the move = ", result);
								} else {
									console.log("Not a game player");
									toast.warning("Wait for your turn!", {
										position: toast.POSITION.TOP_RIGHT,
									});
									return;
								}
								break;
						}
					} else {
						toast.warning("You need to be one of the players to play the game", {
							position: toast.POSITION.TOP_RIGHT,
						});
						return;
					}
				}
			}
		} catch (e) {
			console.log("Error while finding games", e);
		}
	};

	const renderSquare = (i) => {
		return (
			<Square
				value={squares[i]}
				onClick={() => {
					handleClick(i);
				}}
			/>
		);
	};
	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		// setGameWinner(winner);
		status = "Winner: " + winner;
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	let gameObject = {};
	if (selectedGame) {
		gameObject = decodeBitwise(selectedGame.gameBoard);
	}

	useEffect(() => {
		if (selectedGame) {
			setBoard();
		}
	}, [selectedGame]);

	return (
		<>
			<ToastContainer />
			<NavBarConnect />
			<Container>
				<Row>
					<Col md={4}>
						<Row>
							<div className="board-row">
								{renderSquare(0)}
								{renderSquare(1)}
								{renderSquare(2)}
							</div>
							<div className="board-row">
								{renderSquare(3)}
								{renderSquare(4)}
								{renderSquare(5)}
							</div>
							<div className="board-row">
								{renderSquare(6)}
								{renderSquare(7)}
								{renderSquare(8)}
							</div>
						</Row>
						<Row>
							<br />
							{selectedGame && selectedGame.gameContract ? (
								<div>
									<br />
									Your game contract is{" "}
									<a href={`https://l2scan.scroll.io/address/${selectedGame.gameContract}`} target="_blank">
										{truncateEthAddress(selectedGame.gameContract)}
									</a>
								</div>
							) : null}

							<div className="status">{status}</div>
						</Row>
					</Col>
					<Col md={8}>
						<div>
							<NewGame />
						</div>
						{/* <br /> */}
						<hr></hr>
						{/* <br /> */}
						<div>
							<AllGames selectedGameFunc={selectedGameFunc} />
						</div>
					</Col>
				</Row>
				<hr></hr>
				<Row>
					<HowTo />
				</Row>
			</Container>
		</>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 5, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
