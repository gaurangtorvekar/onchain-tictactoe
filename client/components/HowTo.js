import React from "react";
import { Card, ListGroup } from "react-bootstrap";

export function HowTo() {
	return (
		<>
			<Card className="howToCard" border="success">
				<Card.Body>
					<Card.Title>How to play?</Card.Title>
					<Card.Text>This is on-chain tictactoe. In this game, every move is recorded in a Smart Contract, which is created using optimized bitwise operators.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>1. First, connect your Metamask wallet</ListGroup.Item>
					<ListGroup.Item>2. If you have already created a game, "Choose" that game from the table to continue.</ListGroup.Item>
					<ListGroup.Item>3. If want to start a New Game, enter the address of the second player.</ListGroup.Item>
				</ListGroup>
				<Card.Body>
					<Card.Subtitle className="mb-2 text-muted">Contact Me</Card.Subtitle>
					<Card.Link href="https://linkedin.com/in/gaurang-solidity-dev/" target="_blank">
						LinkedIn
					</Card.Link>
					<Card.Link href="https://twitter.com/gaurangtorvekar" target="_blank">
						Twitter
					</Card.Link>
				</Card.Body>
			</Card>
		</>
	);
}
