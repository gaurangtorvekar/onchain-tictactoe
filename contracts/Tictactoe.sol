// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/// @dev A Game board is represented by a uint256,
// 21 bits for each game
//
// 00 00 00 |
// 00 00 00 |= first 18 bits [000000000000000000]
// 00 00 00 |
//
//  [00]     [0]    [00 00 00 00 00 00 00 00 00]
// ------  ------  ------------------------------
//  STATE   TURN              BOARD
contract Tictactoe {
    error Unauthorized();

    uint256 gameBoard = 0;

    //     1. 00 00 00
    //        00 00 00
    //        11 11 11
    //     => 0b111111 = 0x3F
    uint256 internal constant HORIZONTAL_MASK = 0x3F;
    //     2. 00 00 11
    //        00 00 11
    //        00 00 11
    //     => 0b11000011000011 = 0x30C3
    uint256 internal constant VERTICAL_MASK = 0x30C3;
    //     3. 11 00 00
    //        00 11 00
    //        00 00 11
    //     => 0b110000001100000011 = 0x30303
    uint256 internal constant BR_TO_TL_DIAGONAL_MASK = 0x30303;
    //     4. 00 00 11
    //        00 11 00
    //        11 00 00
    //     => 0b1100110011 = 0x3330
    uint256 internal constant BL_TO_TR_DIAGONAL_MASK = 0x3330;

    address internal playerOne;
    address internal playerTwo;
    address[] players;

    constructor(address _playerTwo) {
        require(_playerTwo != address(0));
        playerOne = msg.sender;
        playerTwo = _playerTwo;
        players.push(playerOne);
        players.push(playerTwo);
    }

    /// @notice Checks is the player is registered
    /// @param _player is the the current player making a move
    modifier isPlayer(address _player) {
        if (_player != playerOne && _player != playerTwo) {
            revert Unauthorized();
        }
        _;
    }

    /// @notice Checks if it is `player` turn
    /// @param _player is the the current player making a move
    /// @dev The 19th bit holds the data for who is to play next
    modifier isTurn(address _player) {
        require((gameBoard >> 18 & 0x1) == playerId(_player), "Not your turn");
        _;
    }

    /// @notice Making sure a user is making a valid move. i.e playing a move that
    /// has been played by `player1` or `player2`
    /// @param _move the position `playerN` chooses to play
    modifier moveIsValid(uint256 _move) {
        uint256 p1 = _move << 1;
        uint256 p2 = p1 + 1;
        uint256 _gameBoard = gameBoard;

        require(!(((_gameBoard >> p1) & 1) == 1 || ((_gameBoard >> p2) & 1) == 1), "invalid move");
        require(_move < 9, "invalid move");
        _;
    }

    function playerId(address playerAddr) internal view returns (uint256) {
        return playerAddr == playerOne ? 0 : 1;
    }

    /// @notice a new game is created by appending 21bits to the current board
    function newGame() external isPlayer(msg.sender) returns (uint256) {
        /// gameBoard = 0
        /// gameBoard << 20 => bin: 0b100000000000000000000
        ///                    hex: 0x100000
        uint256 _gameBoard = gameBoard;

        if (_gameBoard > 0) {
            _gameBoard = _gameBoard << 21 | 1 << 20;
        } else {
            _gameBoard = _gameBoard | 1 << 20;
        }

        gameBoard = _gameBoard;
        return _gameBoard;
    }

    function getGame() external view returns (uint256) {
        return gameBoard;
    }

    /// @notice Adding move to the game board
    /// @param _move the position `playerN` chooses to play
    /// @dev here is what a board looks like
    /// 1st - 18th bits
    /// 00 00 00 |   0  1  2
    /// 00 00 00 |=  3  4  5
    /// 00 00 00 |   6  7  8
    function move(uint256 _move)
        external
        isPlayer(msg.sender)
        isTurn(msg.sender)
        moveIsValid(_move)
        returns (uint256)
    {
        /// Checks if the gameState bits isn't set yet
        /// By default it is [10]
        ///
        /// [10] [0]  [00 00 00 00 00 00 00 00 00]
        /// ----
        /// state
        ///
        /// [1 0] => Game is still on
        /// [1 1] => Player 0 won
        /// [0 1] => player 1 won

        uint256 _gameBoard = gameBoard;

        require(_gameBoard >> 19 & 1 == 0 && _gameBoard >> 20 & 1 == 1, "Game has ended");

        uint256 _playerId = playerId(msg.sender);

        /// Since we can locate a position by a number
        /// keep in mind that for position 0 played by `player1` is different
        /// from position 0 player by `player2`
        ///
        /// In each position there are 2 points [0 0] lets say [a'p, a'p]
        /// where `a` is the position and `p` is the player.
        ///
        /// Now, position zero `0` == [0'2 (player 2), 0'1 (player 1)]
        ///
        /// If player one plays on position zero
        /// 00 00 00 00 00 00 00 00 00
        ///                          ^
        ///                       spot zero
        /// Then we'd just flip the bit there, there using
        /// (1 << (position << 1))

        _gameBoard = _gameBoard ^ (1 << ((_move << 1) + _playerId));

        // uint256 moveby = (_move << 1) + _playerId;
        // gameBoard = gameBoard | ( 1 << moveby);

        /// Keeping tracking of who to play next
        /// Next to play is represented by the
        /// 00 0 00 00 00 00 00 00 00 00 00
        ///    ^
        /// play next
        /// flips the bit for the next  player
        /// 0 => `player1` turn
        /// 1 => `player2` turn
        gameBoard = _gameBoard ^ (1 << 18);

        /// checks if `_playerId` has made win
        /// 1 => means the `_playerId` has won
        /// 2 => means no more fields to play, then it's a draw
        /// 0 => continue to play
        uint256 gameState = checkState(_playerId);

        if (gameState == 1) {
            gameBoard = gameBoard ^ (1 << (19 + _playerId));
            return 1;
        } else if (gameState == 2) {
            return 2;
        }

        return 0;
    }

    function checkState(uint256 _playerId) public view returns (uint256) {
        uint256 _gameBoard = gameBoard;

        /// These are the HORIZONTAL wins
        /// 1. x  x  x  2. | 0  0  0  3. | 0  0  0
        ///    0  0  0     | x  x  x     | 0  0  0
        ///    0  0  0     | 0  0  0     | x  x  x
        ///
        /// For player 0
        /// H1. 10 10 10
        ///     00 00 00 =   000000000000010101
        ///     00 00 00
        ///
        /// H2. 00 00 00
        ///     10 10 10 =   000000010101000000 : H1 << 6
        ///     00 00 00
        ///
        /// H3. 00 00 00
        ///     00 00 00 =   010101000000000000 : H2 << 6 or H1 << 12
        ///     10 10 10
        ///
        /// HORIZONTAL_MASK / 3 == H1
        ///
        /// There is probaly a better way to do this, would figure
        /// that out later

        if ((_gameBoard & HORIZONTAL_MASK) == ((HORIZONTAL_MASK / 3) << _playerId)) {
            return 1;
        } else if ((_gameBoard & (HORIZONTAL_MASK << 6)) == ((HORIZONTAL_MASK / 3) << _playerId) << 6) {
            return 1;
        } else if ((_gameBoard & (HORIZONTAL_MASK << 12)) == ((HORIZONTAL_MASK / 3) << _playerId) << 12) {
            return 1;
        }

        /// These are the VERTICAL wins
        /// 1. x  0  0  2. | 0  x  0  3. | 0  0  x
        ///    x  0  0     | 0  x  0     | 0  0  x
        ///    x  0  0     | 0  x  0     | 0  0  x
        ///
        /// For player 0
        /// V1. 10 00 00
        ///     10 00 00 =   000001000001000001
        ///     10 00 00
        ///
        /// V2. 00 10 00
        ///     00 10 00 =   000100000100000100 : V1 << 2
        ///     00 10 00
        ///
        /// V3. 00 00 10
        ///     00 00 10 =   010000010000010000 : V2 << 2 or V1 << 4
        ///     00 00 10
        ///
        /// VERTICAL_MASK / 3 == V1

        if ((_gameBoard & VERTICAL_MASK) == (VERTICAL_MASK / 3) << _playerId) {
            return 1;
        } else if ((_gameBoard & (VERTICAL_MASK << 2)) == (VERTICAL_MASK / 3) << _playerId << 2) {
            return 1;
        } else if ((_gameBoard & (VERTICAL_MASK << 4)) == (VERTICAL_MASK / 3) << _playerId << 4) {
            return 1;
        }

        /// These are the DIAGONAL wins
        /// 1. x  0  0  2. | 0  0  x
        ///    0  x  0     | 0  x  0
        ///    0  0  x     | x  0  0
        ///
        /// For player 0
        /// D1. 10 00 00
        ///     00 10 00 =   010000000100000001
        ///     00 00 10
        ///
        /// D2. 00 00 10
        ///     00 10 00 =   000001000100010000
        ///     10 00 00
        ///
        /// BL_TO_TR_DIAGONAL_MASK / 3 == D1
        /// BR_TO_TL_DIAGONAL_MASK / 3 == D2

        if ((_gameBoard & BR_TO_TL_DIAGONAL_MASK) == (BR_TO_TL_DIAGONAL_MASK / 3) << _playerId) {
            return 1;
        }

        if ((_gameBoard & BL_TO_TR_DIAGONAL_MASK) == (BL_TO_TR_DIAGONAL_MASK / 3) << _playerId) {
            return 1;
        }

        unchecked {
            /// Checks if all fields has been played
            for (uint256 x = 0; x < 9; x++) {
                if (_gameBoard & 1 == 0 && _gameBoard & 2 == 0) {
                    return 0;
                }
                _gameBoard = _gameBoard >> 2;
            }

            /// A Draw
            return 2;
        }
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
