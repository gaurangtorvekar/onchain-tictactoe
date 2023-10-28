// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

contract TictactoeRegistry {
    struct Game {
        address firstPlayer;
        address secondPlayer;
        address gameContract;
    }

    error GameAlreadyExists(address gameContract);

    // Mapping of firstPlayer => Game
    mapping(address => Game[]) public FirstPlayerGames;
    mapping(address => Game[]) public SecondPlayerGames;

    // We are assuming that the caller is the firstPlayer
    function register(address _firstPlayer, address _secondPlayer, address _gameContract) public {
        require(msg.sender == _firstPlayer || msg.sender == _secondPlayer);
        bool newGame = true;
        for (uint256 i = 0; i < FirstPlayerGames[msg.sender].length; i++) {
            if (FirstPlayerGames[msg.sender][i].secondPlayer == _secondPlayer) {
                newGame = false;
                revert GameAlreadyExists(_gameContract);
            }
        }
        if (newGame) {
            Game memory game;
            game.firstPlayer = msg.sender;
            game.secondPlayer = _secondPlayer;
            game.gameContract = _gameContract;
            FirstPlayerGames[_firstPlayer].push(game);
            SecondPlayerGames[_secondPlayer].push(game);
        }
    }

    function getGameList(address _player) public view returns (Game[] memory) {
        uint256 totalGames = FirstPlayerGames[_player].length + SecondPlayerGames[_player].length;
        Game[] memory games = new Game[](totalGames);
        uint256 count = 0;

        for (uint256 i = 0; i < FirstPlayerGames[_player].length; i++) {
            games[count] = FirstPlayerGames[_player][i];
            count++;
        }

        for (uint256 i = 0; i < SecondPlayerGames[_player].length; i++) {
            games[count] = SecondPlayerGames[_player][i];
            count++;
        }

        return games;
    }
}
