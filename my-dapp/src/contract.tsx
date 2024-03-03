import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev'); //KT1TQw4SHVWdV2gtvromK8HrmkNWsx6Sxcj7

export const transferTemporaryOwnership = async (
    // contractAddress: string, // Address of your deployed smart contract
    tokenId: string,         // Token ID as a number
    newOwner: string,        // New owner's address as a string
    duration: number         // Duration in seconds as a number
) => {
    try {
        const contract = await tezos.wallet.at("KT1TQw4SHVWdV2gtvromK8HrmkNWsx6Sxcj7");
        // const ownership = await contract.methods.set_ownership({token_id:123, new_owner: "tz1NmeKVKn8DfQk3scX3nSQgtbnXeuj9sszd"}).send();
        // const royalty = await contract.methods.set_royalities({token_id:123, duration: 7}).send();
        
        const op = await contract.methods.transfer_temporary_ownership({
            new_owner: newOwner,
            token_id: tokenId,
            duration: duration
        }).send();
        console.log("test" + op.confirmation())

        // await op.confirmation();
        return op.opHash;
    } catch (error) {
        console.error('Error in calling contract entry point:', error);
        throw error;
    }
};
