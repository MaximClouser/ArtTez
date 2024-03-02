import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";

const Transfer = ({
  Tezos,
}: {
  Tezos: TezosToolkit;
}): JSX.Element => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendTez = async (): Promise<void> => {
    if (recipient && amount) {
      setLoading(true);
      try {
        const op = await Tezos.wallet
          .transfer({ to: recipient, amount: parseInt(amount), mutez: true })
          .send();
        await op.confirmation();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="transfer-inputs">
      Recipient: <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <br />
      Amount in uTez:<input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <br />
      <button
        className="button"
        disabled={!recipient && !amount}
        onClick={sendTez}
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
  );
};

export default Transfer;