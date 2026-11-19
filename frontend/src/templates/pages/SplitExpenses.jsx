
import { useState } from "react";
import "../../static/css/SplitExpenses.css";

function SplitExpenses({ onBack }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("2");
  const [names, setNames] = useState("");
  const [result, setResult] = useState(false);
  const [error, setError] = useState("");

  const handleSplit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid bill amount.");
      return;
    }

    if (Number(people) < 2 || Number(people) > 20) {
      setError("Choose between 2 and 20 people.");
      return;
    }

    setError("");
    setResult(true);
  };

  const share = Number(amount) / Number(people);

  return (
    <main className="split-page">
      <header className="split-header">
        <button onClick={onBack}>←</button>
        <div>
          <h2>Split Expenses</h2>
          <p>Share bills with your friends</p>
        </div>
      </header>

      {!result ? (
        <form className="split-card" onSubmit={handleSplit}>
          <div className="split-hero">
            <span>₹</span>
            <h1>Split it fairly.</h1>
            <p>Calculate everyone's share in seconds.</p>
          </div>

          <label>Expense name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dinner, Movie, Trip"
          />

          <label>Total bill amount (₹)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter total amount"
          />

          <label>Number of people</label>
          <select
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          >
            {Array.from({ length: 19 }, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>{n} people</option>
            ))}
          </select>

          <label>Friend names (optional)</label>
          <input
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="Aman, Rahul, Sara"
          />

          {error && <p className="split-error">{error}</p>}

          <button className="split-primary" type="submit">
            Calculate Split
          </button>
        </form>
      ) : (
        <section className="split-result">
          <span className="split-result-label">EQUAL SPLIT SUMMARY</span>
          <h1>{title}</h1>

          <div className="split-total">
            <span>Total expense</span>
            <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
          </div>

          <div className="split-share">
            <span>Each person pays</span>
            <strong>₹{share.toFixed(2)}</strong>
            <small>Split between {people} people</small>
          </div>

          <div className="split-members">
            {(names.split(",").map((name) => name.trim()).filter(Boolean).length
              ? names.split(",").map((name) => name.trim()).filter(Boolean).slice(0, Number(people))
              : Array.from({ length: Number(people) }, (_, i) => `Person ${i + 1}`)
            ).map((name, index) => (
              <div key={`${name}-${index}`}>
                <span className="split-avatar">{name.charAt(0).toUpperCase()}</span>
                <span>{name}</span>
                <strong>₹{share.toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <p className="split-note">
            This is only a calculation. No payment requests have been sent.
          </p>

          <button className="split-primary" onClick={() => setResult(false)}>
            Edit Expense
          </button>
          <button className="split-secondary" onClick={onBack}>
            Back to Home
          </button>
        </section>
      )}
    </main>
  );
}

export default SplitExpenses;
