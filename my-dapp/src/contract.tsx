import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev'); //KT1TQw4SHVWdV2gtvromK8HrmkNWsx6Sxcj7

export const transferTemporaryOwnership = async (
    tokenId: string,         // Token ID as a number
    newOwner: string,        // New owner's address as a string
    owner: string         // Duration in seconds as a number
) => {
    try {
        console.log("NEW OWNER: ",newOwner);
        console.log("Token_ID: ", tokenId);
        console.log("OG Owner: ", owner);
        const contract = await tezos.wallet.at("KT1TQw4SHVWdV2gtvromK8HrmkNWsx6Sxcj7"); // contract address

        const ownership = await contract.methods.set_ownership({token_id: tokenId, owner_address: owner}).send();
        const royalty = await contract.methods.set_royalities({token_id: tokenId, royalty: 5}).send();
        
        const op = await contract.methods.transfer_temporary_ownership({
            new_owner: newOwner,
            token_id: tokenId,
        }).send();
        console.log("test" + op.confirmation())

        // await op.confirmation();
        return op.opHash;
    } catch (error) {
        console.error('Error in calling contract entry point:', error);
        throw error;
    }
};
