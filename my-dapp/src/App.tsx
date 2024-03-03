import React, { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import ConnectButton from './components/ConnectWallet';
import Transfer from './components/Transfer';
import ChooseNFTButton from './components/chooseNft'; 
import './App.css';

const App = () => {
  const [Tezos] = useState(new TezosToolkit('https://ghostnet.ecadinfra.com'));
  const [wallet, setWallet] = useState<BeaconWallet | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>(undefined);

  if (!userAddress) {
    return (
      <ConnectButton
        Tezos={Tezos}
        setUserAddress={setUserAddress}
        setWallet={setWallet}
        wallet={wallet}
      />
    );
  }

  if (!selectedTokenId) {
    return (
      <ChooseNFTButton
        userAddress={userAddress}
        onSelectTokenId={setSelectedTokenId}
      />
    );
  }

  return (
    <Transfer
      Tezos={Tezos}
      tokenId={selectedTokenId}
    />
  );
};

export default App;


