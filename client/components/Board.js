import React, { useState, useEffect } from "react";
import { Square } from "./Square";
import { NewGame } from "./NewGame";
import { NavBarConnect } from "./NavBarConnect";
import { AllGames } from "./AllGames";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { useEagerConnect } from "@/utils/useEagerConnect";
import { useWeb3React } from "@web3-react/core";

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

	const handleClick = (i) => {
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
		if (!winner) {
			squaresClone[i] = xIsNext ? "X" : "O";
			setSquares(squaresClone);
			setXIsNext(!xIsNext);
		} else {
			toast.warning("Game is over!", {
				position: toast.POSITION.TOP_RIGHT,
			});
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

	useEffect(() => {}, []);
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
									Your game contract is{" "}
									<a href={`https://mumbai.polygonscan.com/address/${selectedGame.gameContract}`} target="_blank">
										{truncateEthAddress(selectedGame.gameContract)}
									</a>
									{/* <Button variant="info">Set up game</Button> */}
								</div>
							) : null}

							<div className="status">{status}</div>
						</Row>
					</Col>
					<Col md={8}>
						<div>
							<NewGame />
						</div>
						<br />
						<hr></hr>
						<br />
						<div>
							<AllGames selectedGameFunc={selectedGameFunc} />
						</div>
					</Col>
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
