import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://YOUR_RPC_URL');

export const transferTemporaryOwnership = async (
    contractAddress: string, // Address of your deployed smart contract
    tokenId: number,         // Token ID as a number
    newOwner: string,        // New owner's address as a string
    duration: number         // Duration in seconds as a number
) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const op = await contract.methods.transfer_temporary_ownership({
            token_id: tokenId,
            new_owner: newOwner,
            duration: duration
        }).send();

        await op.confirmation();
        return op.opHash;
    } catch (error) {
        console.error('Error in calling contract entry point:', error);
        throw error;
    }
};
