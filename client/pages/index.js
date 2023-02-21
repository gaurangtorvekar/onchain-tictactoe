import "bootstrap/dist/css/bootstrap.min.css";
import Board from "../components/Board";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
	provider.on("accountsChanged", () => {
		if (typeof window !== undefined) {
			window.localStorage.removeItem("token");
		}
	});
	return new Web3Provider(provider);
}

export default function Home() {
	return (
		<div className="game">
			<div className="game-board">
				<Web3ReactProvider getLibrary={getLibrary}>
					<Board />
				</Web3ReactProvider>
			</div>
			<div className="game-info"></div>
		</div>
	);
}
