
import { useState } from "react";
import "../../static/css/RequestMoney.css";

function RequestMoney({ onBack }) {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");

  const handleRequest = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter the person's name.");
      return;
    }

    if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      setError("Please enter a valid demo UPI ID.");
      return;
    }

    if (!amount || Number(amount) <= 0 || Number(amount) > 100000) {
      setError("Please enter an amount between ₹1 and ₹1,00,000.");
      return;
    }

    setError("");
    setRequest({
      name: name.trim(),
      upiId: upiId.trim(),
      amount: Number(amount),
      note: note.trim(),
      id: `REQ${Date.now().toString().slice(-8)}`,
    });
  };

  return (
    <main className="request-page">
      <header className="request-header">
        <button onClick={onBack}>←</button>
        <div>
          <h2>Request Money</h2>
          <p>Ask someone to pay you</p>
        </div>
      </header>

      {!request ? (
        <form className="request-card" onSubmit={handleRequest}>
          <div className="request-hero">
            <div className="request-hero-icon">₹</div>
            <h1>Receive with ease.</h1>
            <p>Create a payment request for someone.</p>
          </div>

          <label>Person's name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />

          <label>UPI ID</label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
          />

          <label>Amount (₹)</label>
          <input
            type="number"
            min="1"
            max="100000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <label>Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Dinner bill"
          />

          {error && <p className="request-error">{error}</p>}

          <button className="request-primary" type="submit">
            Create Demo Request
          </button>
        </form>
      ) : (
        <section className="request-result">
          <div className="request-success-icon">✓</div>
          <span className="request-eyebrow">REQUEST CREATED</span>
          <h1>Request generated!</h1>
          <p className="request-result-subtitle">
            Your demo payment request details are ready.
          </p>

          <div className="request-details">
            <div><span>Request ID</span><strong>{request.id}</strong></div>
            <div><span>Requested from</span><strong>{request.name}</strong></div>
            <div><span>UPI ID</span><strong>{request.upiId}</strong></div>
            <div><span>Amount</span><strong>₹{request.amount.toLocaleString("en-IN")}</strong></div>
            {request.note && <div><span>Note</span><strong>{request.note}</strong></div>}
            <div><span>Status</span><strong className="request-pending">Demo Pending</strong></div>
          </div>

          <p className="request-disclaimer">
            This request has not been sent to the UPI network or to another user.
          </p>

          <button
            className="request-primary"
            onClick={() => {
              setRequest(null);
              setName("");
              setUpiId("");
              setAmount("");
              setNote("");
            }}
          >
            Create Another Request
          </button>

          <button className="request-secondary" onClick={onBack}>
            Back to Home
          </button>
        </section>
      )}

      <p className="request-footer">
        PayWave educational simulation. No real payment request is sent.
      </p>
    </main>
  );
}

export default RequestMoney;
