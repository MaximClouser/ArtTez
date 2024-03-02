import { Dispatch, SetStateAction, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
} from "@airgap/beacon-dapp";

type ButtonProps = {
  Tezos: TezosToolkit;
  setUserAddress: Dispatch<SetStateAction<string | undefined>>;
  setWallet: Dispatch<SetStateAction<BeaconWallet | undefined>>;
  wallet: BeaconWallet | undefined;
};

const ConnectButton = ({
  Tezos,
  setUserAddress,
  setWallet,
  wallet,
}: ButtonProps): JSX.Element => {
  const connectWallet = async (): Promise<void> => {
    try {
      await wallet!.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.ecadinfra.com",
        },
      });
      const userAddress = await wallet!.getPKH();
      setUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const wallet = new BeaconWallet({
        name: "My dApp",
        preferredNetwork: NetworkType.GHOSTNET,
        disableDefaultEvents: false,
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
    })();
  }, []);

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect wallet
        </span>
      </button>
    </div>
  );
};

export default ConnectButton;