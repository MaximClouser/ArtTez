import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { transferTemporaryOwnership } from "../contract.tsx";

const Transfer = ({
  Tezos,
}: {
  Tezos: TezosToolkit;
}): JSX.Element => {
  const [recipient, setRecipient] = useState<string>("");
  const [token_id, setTokenID] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendTez = async (): Promise<void> => {
    if (recipient && token_id && percentage && duration) {
      setLoading(true);
      try { 

        const opHash = await transferTemporaryOwnership(
          'contract_address', // Replace with your contract address
          parseInt(token_id),               
          recipient,
          parseInt(duration),           
        );
        //console.log(opHash)

        // If transferTemporaryOwnership is successful, proceed to transfer Tezos
        // const op = await Tezos.wallet
        //   // .transfer({ to: recipient, parameter: {amount: parseInt(amount), percentage: parseInt(percentage), duratioin:}, mutez: true })
        //   .transfer({ to: recipient, amount: parseInt(token_id), mutez: true })
        //   .send();
        // await op.confirmation();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <header style={{ color: '#000000', padding: '25px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Demo</h1>
      </header>

      <div id="transfer-inputs" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Recipient:</label>
        <input
          type="text"
          placeholder="Recipient's Address"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
        />

        <label style={{ display: 'block', marginBottom: '10px' }}>Token ID:</label>
        <input
          type="text"
          placeholder="Token ID"
          value={token_id}
          onChange={e => setTokenID(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
        />

        <label style={{ display: 'block', marginBottom: '10px' }}>Royalty Percentage:</label>
        <select
          value={percentage}
          onChange={e => setPercentage(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          <option value="5">5%</option>
          <option value="10">10%</option>
          <option value="15">15%</option>
          <option value="20">20%</option>
          <option value="25">25%</option>
          <option value="30">30%</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px' }}>Duration (Days):</label>
        <input
          type="number"
          placeholder="Duration"
          value={duration}
          onChange={e => {
            const value = parseInt(e.target.value);
        
            // Ensure that the duration is not below 0
            if (!isNaN(value) && value > -1) {
              setDuration(value);
            }
          }}
          
          style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
        />

        <div style={{ height: '30px' }}></div>

        <button
          id="send-button"
          className="button"
          disabled={!recipient || !token_id || !percentage}
          onClick={sendTez}
          style={{ width: '100%', padding: '15px', backgroundColor: '#336699', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i>&nbsp; Sending...
            </span>
          ) : (
            <span>
              <i className="far fa-paper-plane"></i>&nbsp; Send
            </span>
          )}
        </button>
      </div>
</div>

  );
};

export default Transfer;