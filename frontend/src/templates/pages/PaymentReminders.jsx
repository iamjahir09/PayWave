
import { useCallback, useEffect, useState } from "react";

import {
  createPaymentReminder,
  getPaymentReminders,
  markReminderPaid,
  deletePaymentReminder,
} from "../services/paywaveApi";

import "../../static/css/PaymentReminders.css";

function PaymentReminders({ onBack }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [payee, setPayee] = useState("");

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const formatCurrency = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Number(value || 0));

  const getErrorMessage = (err) =>
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (typeof err?.response?.data === "string"
          ? err.response.data
          : null) ||
      err?.message ||
      "Something went wrong. Please try again.";

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const dateValue = new Date(`${value}T00:00:00`);

    if (Number.isNaN(dateValue.getTime())) return value;

    return dateValue.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Load reminders from backend
  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPaymentReminders();
      const data = response.data;

      setReminders(
          Array.isArray(data)
              ? data
              : Array.isArray(data?.content)
                  ? data.content
                  : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // Create reminder
  const handleAdd = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericAmount = Number(amount);

    if (!title.trim()) {
      setError("Please enter a reminder title.");
      return;
    }

    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0 ||
        !/^\d+(\.\d{1,2})?$/.test(amount)
    ) {
      setError("Enter a valid amount with up to 2 decimal places.");
      return;
    }

    if (!date) {
      setError("Please select a due date.");
      return;
    }

    if (date < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        amount: numericAmount,
        dueDate: date,
        payee: payee.trim() || null,
      };

      await createPaymentReminder(payload);

      setTitle("");
      setAmount("");
      setDate("");
      setPayee("");

      setSuccess("Payment reminder saved successfully!");

      await loadReminders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Mark reminder as paid
  const handleMarkPaid = async (id) => {
    setError("");
    setSuccess("");
    setActionId(id);

    try {
      await markReminderPaid(id);

      setSuccess("Reminder marked as paid.");

      await loadReminders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  // Delete reminder
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    setError("");
    setSuccess("");
    setActionId(id);

    try {
      await deletePaymentReminder(id);

      setSuccess("Reminder deleted successfully.");

      await loadReminders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = a.dueDate || "";
    const dateB = b.dueDate || "";
    return dateA.localeCompare(dateB);
  });

  const pendingCount = reminders.filter(
      (item) => String(item.status).toUpperCase() !== "PAID"
  ).length;

  const paidCount = reminders.length - pendingCount;

  return (
      <main className="reminder-page">

        {/* HEADER */}
        <header className="reminder-header">
          <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
          >
            ←
          </button>

          <div>
            <h2>Payment Reminders</h2>
            <p>Never miss a due date</p>
          </div>
        </header>

        {/* HERO */}
        <section className="reminder-hero">
          <span className="reminder-hero-icon">◷</span>

          <h1>Stay on schedule.</h1>

          <p>Keep your upcoming payments organised.</p>

          <div className="reminder-stats">
            <div className="reminder-count">
              <strong>{reminders.length}</strong>
              <span>All reminders</span>
            </div>

            <div className="reminder-count">
              <strong>{pendingCount}</strong>
              <span>Pending</span>
            </div>

            <div className="reminder-count">
              <strong>{paidCount}</strong>
              <span>Paid</span>
            </div>
          </div>
        </section>

        {/* ADD REMINDER FORM */}
        <form className="reminder-form" onSubmit={handleAdd}>
          <h3>Add a reminder</h3>

          <label htmlFor="reminder-title">
            Reminder title
          </label>

          <input
              id="reminder-title"
              type="text"
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Electricity Bill"
              required
          />

          <label htmlFor="reminder-payee">
            Payee / Provider (optional)
          </label>

          <input
              id="reminder-payee"
              type="text"
              maxLength={255}
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              placeholder="e.g. Electricity Board"
          />

          <label htmlFor="reminder-amount">
            Amount (₹)
          </label>

          <input
              id="reminder-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
          />

          <label htmlFor="reminder-date">
            Due date
          </label>

          <input
              id="reminder-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
          />

          {error && (
              <p className="reminder-error" role="alert">
                {error}
              </p>
          )}

          {success && (
              <p className="reminder-success" role="status">
                {success}
              </p>
          )}

          <button
              className="reminder-primary"
              type="submit"
              disabled={saving}
          >
            {saving ? "Saving reminder..." : "+ Add Reminder"}
          </button>
        </form>

        {/* REMINDER LIST */}
        <section className="reminder-list-section">
          <div className="reminder-list-heading">
            <div>
              <h3>Your Reminders</h3>
              <p>{reminders.length} saved reminders</p>
            </div>

            <button
                type="button"
                className="reminder-refresh"
                onClick={loadReminders}
                disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
              <div className="reminder-empty">
                Loading your reminders...
              </div>
          ) : sortedReminders.length === 0 ? (
              <div className="reminder-empty">
                <span>◷</span>
                <h3>No reminders yet</h3>
                <p>Add your first reminder above.</p>
              </div>
          ) : (
              <div className="reminder-list">
                {sortedReminders.map((item) => {
                  const isPaid =
                      String(item.status).toUpperCase() === "PAID";

                  const isOverdue =
                      !isPaid && item.dueDate && item.dueDate < today;

                  return (
                      <article
                          className="reminder-item"
                          key={item.id}
                      >
                        <div className="reminder-item-icon">₹</div>

                        <div className="reminder-item-info">
                          <strong>{item.title}</strong>

                          {item.payee && (
                              <span>{item.payee}</span>
                          )}

                          <small>
                            Due {formatDate(item.dueDate)}
                          </small>

                          <span
                              className={`reminder-status ${
                                  isPaid
                                      ? "paid"
                                      : isOverdue
                                          ? "overdue"
                                          : "pending"
                              }`}
                          >
                      {isPaid
                          ? "PAID"
                          : isOverdue
                              ? "OVERDUE"
                              : "PENDING"}
                    </span>
                        </div>

                        <div className="reminder-item-side">
                          <strong>
                            {formatCurrency(item.amount)}
                          </strong>

                          {!isPaid && (
                              <button
                                  type="button"
                                  className="reminder-paid-button"
                                  onClick={() => handleMarkPaid(item.id)}
                                  disabled={actionId === item.id}
                              >
                                {actionId === item.id
                                    ? "Please wait..."
                                    : "Mark Paid"}
                              </button>
                          )}

                          <button
                              type="button"
                              className="reminder-delete-button"
                              onClick={() => handleDelete(item.id)}
                              disabled={actionId === item.id}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                  );
                })}
              </div>
          )}
        </section>

        <p className="reminder-disclaimer">
          PayWave educational simulation. Reminders are stored
          in your account. No actual phone notification is scheduled.
        </p>

      </main>
  );
}

export default PaymentReminders;
