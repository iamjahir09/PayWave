
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createSplitExpense,
  getMySplitExpenses,
  settleSplitShare,
  getMyProfile,
} from "../services/paywaveApi";

import "../../static/css/SplitExpenses.css";

function SplitExpenses({ onBack }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [participantIds, setParticipantIds] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [myPaywaveId, setMyPaywaveId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settlingId, setSettlingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Currency formatter
  const formatCurrency = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Number(value || 0));

  // API error handler
  const getErrorMessage = (err) =>
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (typeof err?.response?.data === "string"
          ? err.response.data
          : null) ||
      err?.message ||
      "Something went wrong. Please try again.";

  // Load logged-in user's profile
  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();

        if (!active) return;

        setMyPaywaveId(response.data?.paywaveId || "");
      } catch (err) {
        if (!active) return;

        setError("Unable to load your PayWave profile.");
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Load expenses from backend
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMySplitExpenses();
      const data = response.data;

      setExpenses(
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
    loadExpenses();
  }, [loadExpenses]);

  // Remove duplicate PayWave IDs
  const parsedParticipantIds = useMemo(
      () =>
          [
            ...new Set(
                participantIds
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean)
            ),
          ],
      [participantIds]
  );

  // Create expense
  const handleCreateExpense = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const total = Number(amount);

    if (!title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (title.trim().length > 150) {
      setError("Expense title cannot exceed 150 characters.");
      return;
    }

    if (
        !Number.isFinite(total) ||
        total <= 0 ||
        !/^\d+(\.\d{1,2})?$/.test(amount)
    ) {
      setError("Please enter a valid amount with up to 2 decimal places.");
      return;
    }

    if (parsedParticipantIds.length === 0) {
      setError("Please enter at least one participant PayWave ID.");
      return;
    }

    if (parsedParticipantIds.length > 100) {
      setError("You can add up to 100 participants at a time.");
      return;
    }

    if (
        myPaywaveId &&
        parsedParticipantIds.includes(myPaywaveId)
    ) {
      setError(
          "You are already included automatically. Do not add your own PayWave ID."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        totalAmount: total,
        participantPaywaveIds: parsedParticipantIds,
      };

      await createSplitExpense(payload);

      setTitle("");
      setAmount("");
      setParticipantIds("");

      setSuccess("Expense created successfully!");

      await loadExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Settle logged-in user's own share
  const handleSettle = async (shareId) => {
    if (
        !window.confirm(
            "Settle this expense share from your PayWave wallet?"
        )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setSettlingId(shareId);

    try {
      await settleSplitShare(shareId);

      setSuccess("Your share has been settled successfully!");

      await loadExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSettlingId(null);
    }
  };

  // Expense status
  const getExpenseStatus = (expense) => {
    const shares = expense.shares || [];

    const pending = shares.some(
        (share) =>
            String(share.status).toUpperCase() === "PENDING"
    );

    return pending ? "PENDING" : "SETTLED";
  };

  return (
      <main className="split-page">

        {/* HEADER */}
        <header className="split-header">
          <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
          >
            ←
          </button>

          <div>
            <h2>Split Expenses</h2>
            <p>Share bills with your friends</p>
          </div>
        </header>

        {/* HERO */}
        <section className="split-hero">
          <span className="split-hero-icon">₹</span>

          <h1>Split it fairly.</h1>

          <p>
            Create an expense and divide the cost with
            other PayWave users.
          </p>
        </section>

        {/* CREATE EXPENSE */}
        <form
            className="split-card"
            onSubmit={handleCreateExpense}
        >
          <div className="split-card-heading">
            <h2>Create a split</h2>
            <p>Enter the bill details and participants.</p>
          </div>

          <label htmlFor="split-title">
            Expense name
          </label>

          <input
              id="split-title"
              type="text"
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dinner, Movie, Trip"
              required
          />

          <label htmlFor="split-amount">
            Total bill amount (₹)
          </label>

          <input
              id="split-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter total amount"
              required
          />

          <label htmlFor="split-participants">
            Participant PayWave IDs
          </label>

          <textarea
              id="split-participants"
              value={participantIds}
              onChange={(e) => setParticipantIds(e.target.value)}
              placeholder={
                "Enter PayWave IDs separated by commas\nExample: PW123456, PW789012"
              }
              rows={3}
              required
          />

          <p className="split-field-help">
            Enter the PayWave IDs of the people sharing
            this expense. Separate multiple IDs with commas.
            You are included automatically.
          </p>

          {parsedParticipantIds.length > 0 && (
              <div className="split-participant-preview">
                <span>Participants added</span>

                <strong>
                  {parsedParticipantIds.length + 1} people
                </strong>

                <small>Including you</small>
              </div>
          )}

          {amount &&
              Number(amount) > 0 &&
              parsedParticipantIds.length > 0 && (
                  <div className="split-estimate">
                    <span>Estimated share per person</span>

                    <strong>
                      {formatCurrency(
                          Number(amount) /
                          (parsedParticipantIds.length + 1)
                      )}
                    </strong>

                    <small>
                      Final shares may differ by a few paise due to rounding.
                    </small>
                  </div>
              )}

          {error && (
              <p className="split-error" role="alert">
                {error}
              </p>
          )}

          {success && (
              <p className="split-success" role="status">
                {success}
              </p>
          )}

          <button
              className="split-primary"
              type="submit"
              disabled={saving}
          >
            {saving
                ? "Creating expense..."
                : "Create Split Expense"}
          </button>
        </form>

        {/* EXPENSE HISTORY */}
        <section className="split-history">

          <div className="split-history-heading">
            <div>
              <h2>Your Expenses</h2>

              <p>
                Expenses you created or are participating in
              </p>
            </div>

            <button
                type="button"
                className="split-refresh"
                onClick={loadExpenses}
                disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
              <div className="split-empty">
                Loading your expenses...
              </div>
          ) : expenses.length === 0 ? (
              <div className="split-empty">
                <span>₹</span>

                <h3>No split expenses yet</h3>

                <p>
                  Create your first expense to see it here.
                </p>
              </div>
          ) : (
              <div className="split-expense-list">

                {expenses.map((expense) => {
                  const shares = expense.shares || [];
                  const status = getExpenseStatus(expense);

                  return (
                      <article
                          className="split-expense-item"
                          key={expense.id}
                      >

                        {/* EXPENSE HEADER */}
                        <div className="split-expense-top">
                          <div>
                            <h3>{expense.title}</h3>

                            <p>
                              {expense.createdAt
                                  ? new Date(
                                      expense.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  : "Date unavailable"}
                            </p>
                          </div>

                          <span
                              className={`split-status ${
                                  status === "SETTLED"
                                      ? "settled"
                                      : "pending"
                              }`}
                          >
                      {status}
                    </span>
                        </div>

                        {/* TOTAL */}
                        <div className="split-expense-total">
                          <span>Total expense</span>

                          <strong>
                            {formatCurrency(expense.totalAmount)}
                          </strong>
                        </div>

                        {/* SHARES */}
                        <div className="split-share-list">
                          <h4>Participant shares</h4>

                          {shares.map((share) => {
                            const isPending =
                                String(share.status).toUpperCase() ===
                                "PENDING";

                            const isMyShare =
                                Boolean(myPaywaveId) &&
                                share.userPaywaveId === myPaywaveId;

                            return (
                                <div
                                    className="split-share-row"
                                    key={share.id}
                                >
                                  <div className="split-share-person">

                            <span className="split-avatar">
                              {String(
                                  share.userPaywaveId || "?"
                              )
                                  .charAt(0)
                                  .toUpperCase()}
                            </span>

                                    <div>
                                      <strong>
                                        {isMyShare
                                            ? "You"
                                            : share.userPaywaveId}
                                      </strong>

                                      <small>
                                        {isPending
                                            ? "Payment pending"
                                            : "Paid"}
                                      </small>
                                    </div>
                                  </div>

                                  <div className="split-share-action">
                                    <strong>
                                      {formatCurrency(share.shareAmount)}
                                    </strong>

                                    {isPending && isMyShare && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSettle(share.id)
                                            }
                                            disabled={
                                                settlingId === share.id
                                            }
                                        >
                                          {settlingId === share.id
                                              ? "Processing..."
                                              : "Settle"}
                                        </button>
                                    )}
                                  </div>
                                </div>
                            );
                          })}
                        </div>

                      </article>
                  );
                })}

              </div>
          )}
        </section>

        {/* DISCLAIMER */}
        <p className="split-disclaimer">
          PayWave is an educational payment simulation.
          Settling a share transfers funds between PayWave
          wallets, not real bank accounts.
        </p>

      </main>
  );
}

export default SplitExpenses;
