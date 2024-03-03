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
        console.log("Hello Maxim You suck")
        const opHash = await transferTemporaryOwnership(
          'tz1NmeKVKn8DfQk3scX3nSQgtbnXeuj9sszd', // Replace with your contract address
          parseInt(token_id),               
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

  // Render your component JSX
  return (
    <div>
      <header style={{ backgroundColor: '#ffffff', padding: '25px' }}>
        <div className="is-size-5"><strong>Demo</strong></div>
      </header>

      <div id="transfer-inputs" style={{ padding: '20px' }}>
        Recipient:   {' '} <input
          type="text"
          placeholder="Recipient's Address"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <br />
        <div style={{ height: '15px' }}></div>
        Token ID:   {' '} <input
          type="number"
          placeholder="Token ID"
          value={token_id}
          onChange={e => setTokenID(e.target.value)}
        />
        <br />
        <div style={{ height: '15px' }}></div>
        Royalty Percentage:   {' '}
          <select
            value={percentage}
            onChange={e => setPercentage(e.target.value)}
          >
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
            <option value="25">25%</option>
            <option value="30">30%</option>
          </select>
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
        </button>

      </div>
    </div>
  );
};

export default Transfer;