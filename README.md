# On-chain Tictactoe

I created this project in order to get my hands dirty with the latest Scroll #zkEVM! This game works on the Scroll L2 testnet, and you will need some TSETH to play the game.
You can play the game [here](https://onchain-tictactoe.vercel.app/).

## Scroll zkEVM

[Scroll](https://scroll.io/) is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications and tools. It is a L2 solution on top of Ethereum, meant to scale the network and cater to the mainstream audience when blockchain adoption grows by leaps and bounds over the next few years.

You can get the Scroll TSETH through the Scroll Faucet [here](https://scroll.io/prealpha/faucet).

## Smart Contracts

The [Tictactoe.sol](https://github.com/gaurangtorvekar/onchain-tictactoe/blob/main/contracts/Tictactoe.sol) Smart Contract is created using optimized bitwise operations, which makes it relatively cheap to play the game on-chain directly. This Smart Contract was taken from the repo of @0xosas and this article explains the concept very well - https://hackmd.io/@0xosas/S1uWnLChq. I have made a few modifications to this contract to make it work the Next JS app.

The [TictactoeRegistry.sol](https://github.com/gaurangtorvekar/onchain-tictactoe/blob/main/contracts/TictactoeRegistry.sol) Smart Contract is written by me, which is a simple contract that keeps a registry of all the games deployed for a specific player. It helps to retrieve the games for any blockchain address that connects their account.

## Front-end

The UI is a standard Next.js app that was created using create-next-app. I have used the React-Bootstrap framework to give some basic styles to the components and to make the website responsive. I have deployed this app on Vercel.

---

### WIP

Please note that this game is still a WIP. Although the basic game functionality works well, there are still a few features I mean to implement -

- An AI opponent so that you can play against the "system"
- Multisig from both players before they are allowed to "reset" the game
- Adding push notifications when your opponent has played a move
- Move the deployment to the Scroll Goerli testnet (when ready)
- Test out a few edge cases
