import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useEffect, useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";

export function useEagerConnect() {
	const { activate, active, error, account } = useWeb3ReactCore();
	const [tried, setTried] = useState(false);

	const injected = new InjectedConnector({
		supportedChainIds: [534353, 5],
	});

	useEffect(() => {
		injected.isAuthorized().then((isAuthorized) => {
			if (isAuthorized) {
				activate(injected, undefined, true).catch(() => {
					setTried(true);
				});
			} else {
				setTried(true);
			}
		});
	}, [activate, active, account]);

	useEffect(() => {
		if (active) {
			setTried(true);
		}
	}, [active, account]);
	if (error) {
		// console.log("Error in useEagerConnect = ", error);
		return false;
	}
	return tried;
}
