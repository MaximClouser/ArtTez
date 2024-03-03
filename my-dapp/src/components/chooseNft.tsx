import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NFT {
  tokenId: string;
  metadata: {
    artifactUri: string;
    name: string;
  };
}

type ChooseNFTButtonProps = {
  onSelectTokenId: (tokenId: string) => void;
};

const ChooseNFTButton = ({ onSelectTokenId }: ChooseNFTButtonProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [showNFTs, setShowNFTs] = useState(false); // State to toggle NFTs display
  const userAddress = "tz1bcTPoJDSKyKH2NHyxRbZPzZBKZoWHszNb"; // Hardcoded user address

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get(
          `https://api.tzkt.io/v1/tokens/balances?account=${userAddress}&token.metadata.artifactUri.ne=null`
        );
        const nftData = response.data.map((item: any) => ({
          tokenId: item.token.id.toString(),
          metadata: {
            artifactUri: item.token.metadata.artifactUri,
            name: item.token.metadata.name,
          },
        }));
        setNfts(nftData);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    if (showNFTs) {
      fetchNFTs();
    }
  }, [showNFTs]);

  const handleNFTSelect = (tokenId: string) => {
    console.log('Selected NFT with tokenId:', tokenId);
    onSelectTokenId(tokenId);
  };

  const toggleNFTDisplay = () => {
    setShowNFTs(!showNFTs);
  };

  return (
    <div>
      <button onClick={toggleNFTDisplay}>Choose NFT</button>
      {showNFTs && (
        <div>
          {nfts.map((nft, index) => (
            <div key={index} onClick={() => handleNFTSelect(nft.tokenId)}>
              <img src={nft.metadata.artifactUri} alt="NFT" />
              <p>{nft.metadata.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChooseNFTButton;


  