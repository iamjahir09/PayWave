
import { useState } from "react";
import "../../static/css/PaymentReminders.css";

function PaymentReminders({ onBack }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Electricity");
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Monthly Electricity Bill",
      amount: 1200,
      date: "2026-11-25",
      category: "Electricity",
    },
    {
      id: 2,
      title: "Mobile Recharge",
      amount: 299,
      date: "2026-11-28",
      category: "Mobile Recharge",
    },
  ]);
  const [error, setError] = useState("");

  const handleAdd = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a reminder title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!date) {
      setError("Please select a due date.");
      return;
    }

    setReminders((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: title.trim(),
        amount: Number(amount),
        date,
        category,
      },
    ]);

    setTitle("");
    setAmount("");
    setDate("");
    setCategory("Electricity");
    setError("");
  };

  const deleteReminder = (id) => {
    setReminders((previous) => previous.filter((item) => item.id !== id));
  };

  const formatDate = (value) =>
    new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <main className="reminder-page">
      <header className="reminder-header">
        <button onClick={onBack}>←</button>
        <div>
          <h2>Payment Reminders</h2>
          <p>Never miss a due date</p>
        </div>
      </header>

      <section className="reminder-hero">
        <span className="reminder-hero-icon">◷</span>
        <h1>Stay on schedule.</h1>
        <p>Keep your upcoming payments organised.</p>
        <div className="reminder-count">
          <strong>{reminders.length}</strong>
          <span>Saved reminders</span>
        </div>
      </section>

      <form className="reminder-form" onSubmit={handleAdd}>
        <h3>Add a reminder</h3>

        <label>Reminder title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Internet Bill"
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Electricity</option>
          <option>Mobile Recharge</option>
          <option>DTH Recharge</option>
          <option>Water Bill</option>
          <option>Rent</option>
          <option>Other</option>
        </select>

        <label>Amount (₹)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <label>Due date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && <p className="reminder-error">{error}</p>}

        <button className="reminder-primary" type="submit">
          + Add Reminder
        </button>
      </form>

      <section className="reminder-list-section">
        <div className="reminder-list-heading">
          <h3>Your Reminders</h3>
          <span>{reminders.length} total</span>
        </div>

        {reminders.length === 0 ? (
          <div className="reminder-empty">
            <span>◷</span>
            <h3>No reminders yet</h3>
            <p>Add your first reminder above.</p>
          </div>
        ) : (
          <div className="reminder-list">
            {reminders
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((item) => (
                <article className="reminder-item" key={item.id}>
                  <div className="reminder-item-icon">₹</div>

                  <div className="reminder-item-info">
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                    <small>Due {formatDate(item.date)}</small>
                  </div>

                  <div className="reminder-item-side">
                    <strong>₹{item.amount.toLocaleString("en-IN")}</strong>
                    <button
                      type="button"
                      onClick={() => deleteReminder(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>

      <p className="reminder-disclaimer">
        Demo reminders are stored only while this screen remains mounted.
        No actual notification is scheduled.
      </p>
    </main>
  );
}

export default PaymentReminders;
