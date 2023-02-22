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
        Game[] memory games;
        if (FirstPlayerGames[_player].length > 0) {
            games = FirstPlayerGames[_player];
        } else if (SecondPlayerGames[_player].length > 0) {
            games = SecondPlayerGames[_player];
        }
        return games;
    }
}
