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
    if (recipient) {
      setLoading(true);
      try { 
        console.log("Hello Maxim You suck")
        const opHash = await transferTemporaryOwnership(
          'tz1NmeKVKn8DfQk3scX3nSQgtbnXeuj9sszd', // Replace with your contract address
          (token_id),               
          recipient,
          parseInt(duration),           
        );
        console.log(opHash)

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

  // Render your component Tsx
  return (
    <div>
      <header style={{ backgroundColor: '#ffffff', padding: '25px' }}>
        <div className="is-size-5"><strong>Demo</strong></div>
      </header>
      <div style={{ height: '15px' }}></div>
        Token ID:   {' '} <input
          type="text"
          placeholder="Token ID"
          value={token_id}
          onChange={e => setTokenID(e.target.value)}
        />
        <br />
      <div id="transfer-inputs" style={{ padding: '20px' }}>
        Recipient:   {' '} <input
          type="string"
          placeholder="Recipient's Address"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <br />
        <div style={{ height: '15px' }}></div>
        Duration:   {' '} <input
          type="number"
          placeholder="Duration (Days)"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
        <br />
        <div style={{ height: '30px' }}></div>
        <button id="send-button"
          className="button"
          onClick={sendTez} // Use onClick event handler for button click
          // onSubmit={handleSubmit} // You can use onSubmit event handler for form submission (if needed)
        >
          {loading ? (
            <span>
            <i className="far fa-paper-plane"></i>&nbsp; Sending...
            </span>
           ) : (
            <span>
              <i className="far fa-paper-plane"> </i>&nbsp;Send
            </span>
           )
        }
        </button>

      </div>
    </div>
  );
};

export default Transfer;