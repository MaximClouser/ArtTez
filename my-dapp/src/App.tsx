import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectWallet";
import Transfer from "./components/Transfer";
import { BeaconWallet } from "@taquito/beacon-wallet";

const App = () => {
  const [Tezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [wallet, setWallet] = useState<BeaconWallet | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);

  switch (userAddress) {
    case undefined: return <ConnectButton
      Tezos={Tezos}
      setUserAddress={setUserAddress}
      setWallet={setWallet}
      wallet={wallet}
    />;
    default: return <Transfer
      Tezos={Tezos}
    />;

  }
};

export default App;