export function decodeBitwise(input) {
	const binaryInput = Number(input).toString(2);
	// const binaryInput = "100000000000000000001";
	const gameState = binaryInput.slice(0, 2);
	const gameTurn = binaryInput.slice(2, 3);
	const gameBoard = binaryInput.slice(3);

	// console.log("Game State, Game Turn, Game Board = ", gameState, gameTurn, gameBoard);

	let gameObject = {};
	switch (gameState) {
		case "10":
			gameObject.gameState = "Ongoing";
			break;
		case "01":
			gameObject.gameState = "WinnerPlayer1";
			break;
		case "00":
			gameObject.gameState = "WinnerPlayer2";
			break;
		case "11":
			gameObject.gameState = "Draw";
			break;
	}

	switch (gameTurn) {
		//First player's turn
		case "0":
			gameObject.gameTurn = "X";
			break;
		//Second player's turn
		case "1":
			gameObject.gameTurn = "O";
			break;
	}

	let gameBoardArr = [];
	for (let i = 3; i < 21; i++) {
		if (i % 2 != 0) {
			// console.log("In decode function - setting gameBoard");
			let gameElement = binaryInput.slice(i, i + 2);
			if (gameElement == "01") {
				gameBoardArr.push("X");
			} else if (gameElement == "10") {
				gameBoardArr.push("O");
			} else {
				gameBoardArr.push("None");
			}
		}
	}
	const reversedBoard = gameBoardArr.reverse();
	gameObject.gameBoard = reversedBoard;
	return gameObject;
}
