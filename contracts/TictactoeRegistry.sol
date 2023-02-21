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
    mapping(address => Game[]) public Games;

    // We are assuming that the caller is the firstPlayer
    function register(address _firstPlayer, address _secondPlayer, address _gameContract) public {
        require(msg.sender == _firstPlayer || msg.sender == _secondPlayer);
        bool newGame = true;
        for (uint256 i = 0; i < Games[msg.sender].length; i++) {
            if (Games[msg.sender][i].secondPlayer == _secondPlayer) {
                newGame = false;
                revert GameAlreadyExists(_gameContract);
            }
        }
        if (newGame) {
            Game memory game;
            game.firstPlayer = msg.sender;
            game.secondPlayer = _secondPlayer;
            game.gameContract = _gameContract;
            Games[msg.sender].push(game);
        }
    }

    function remove(address _firstPlayer, address _secondPlayer, address _gameContract) public {
        require(msg.sender == _firstPlayer || msg.sender == _secondPlayer);
        for (uint256 i = 0; i < Games[msg.sender].length; i++) {
            if (Games[msg.sender][i].gameContract == _gameContract) {
                // Replaces the current element with the last element and then removes the last element with pop()
                Games[msg.sender][i] = Games[msg.sender][Games[msg.sender].length - 1];
                Games[msg.sender].pop();
            }
        }
    }

    function getGameList(address _firstPlayer) public view returns (Game[] memory) {
        return Games[_firstPlayer];
    }
}
