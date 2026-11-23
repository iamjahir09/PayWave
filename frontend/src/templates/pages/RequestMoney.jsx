
import { useCallback, useEffect, useState } from "react";

import {
  createMoneyRequest,
  getMyMoneyRequests,
  acceptMoneyRequest,
  rejectMoneyRequest,
  getMyProfile,
} from "../services/paywaveApi";

import "../../static/css/RequestMoney.css";

function RequestMoney({ onBack }) {
  const [paywaveId, setPaywaveId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [requests, setRequests] = useState([]);
  const [myPaywaveId, setMyPaywaveId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err) =>
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (typeof err?.response?.data === "string"
          ? err.response.data
          : null) ||
      err?.message ||
      "Something went wrong. Please try again.";

  const formatCurrency = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load logged-in user's profile and money requests
  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [profileResult, requestsResult] =
          await Promise.allSettled([
            getMyProfile(),
            getMyMoneyRequests(),
          ]);

      // Get logged-in user's PayWave ID
      if (profileResult.status === "fulfilled") {
        const profileData = profileResult.value?.data;

        const currentPaywaveId =
            profileData?.paywaveId ||
            profileData?.payWaveId ||
            profileData?.user?.paywaveId ||
            profileData?.user?.payWaveId ||
            "";

        setMyPaywaveId(currentPaywaveId);
      } else {
        setMyPaywaveId("");
      }

      // Get money requests
      if (requestsResult.status === "fulfilled") {
        const data = requestsResult.value?.data;

        setRequests(
            Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : []
        );
      } else {
        setRequests([]);
        throw requestsResult.reason;
      }

      if (profileResult.status === "rejected") {
        setError("Unable to load your profile. Please refresh the page.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Create money request
  const handleRequest = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericAmount = Number(amount);

    if (!paywaveId.trim()) {
      setError("Please enter the payer's PayWave ID.");
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

    if (numericAmount > 100000) {
      setError("Maximum request amount is ₹1,00,000.");
      return;
    }

    if (
        myPaywaveId &&
        paywaveId.trim().toUpperCase() === myPaywaveId.toUpperCase()
    ) {
      setError("You cannot request money from yourself.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        payerPaywaveId: paywaveId.trim(),
        amount: numericAmount,
        note: note.trim() || null,
      };

      await createMoneyRequest(payload);

      setPaywaveId("");
      setAmount("");
      setNote("");

      setSuccess("Money request created successfully!");

      await loadRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Accept incoming request
  const handleAccept = async (id) => {
    const confirmed = window.confirm(
        "Accept this request? The requested amount will be transferred from your wallet."
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setActionId(id);

    try {
      await acceptMoneyRequest(id);

      setSuccess(
          "Request accepted. Payment transferred successfully."
      );

      await loadRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  // Reject incoming request
  const handleReject = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to reject this request?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setActionId(id);

    try {
      await rejectMoneyRequest(id);

      setSuccess("Money request rejected.");

      await loadRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  // Correctly separate incoming and outgoing requests
  const outgoingRequests = myPaywaveId
      ? requests.filter(
          (item) =>
              item.requesterPaywaveId === myPaywaveId
      )
      : [];

  const incomingRequests = myPaywaveId
      ? requests.filter(
          (item) =>
              item.payerPaywaveId === myPaywaveId
      )
      : [];

  const pendingIncoming = incomingRequests.filter(
      (item) => item.status === "PENDING"
  );

  const statusClass = (status) => {
    switch (String(status).toUpperCase()) {
      case "PAID":
        return "paid";

      case "REJECTED":
        return "rejected";

      default:
        return "pending";
    }
  };

  const renderRequest = (item, direction) => {
    const isIncoming = direction === "incoming";
    const isPending = item.status === "PENDING";

    return (
        <article className="request-item" key={item.id}>
          <div className="request-item-icon">
            {isIncoming ? "↓" : "↑"}
          </div>

          <div className="request-item-info">
            <strong>
              {isIncoming
                  ? "Money requested from you"
                  : "Money requested"}
            </strong>

            <span>
            {isIncoming
                ? `From ${item.requesterPaywaveId}`
                : `To ${item.payerPaywaveId}`}
          </span>

            {item.note && <small>{item.note}</small>}

            <small>{formatDate(item.createdAt)}</small>

            <span
                className={`request-status ${statusClass(item.status)}`}
            >
            {item.status || "PENDING"}
          </span>

            {item.reference && (
                <small>Ref: {item.reference}</small>
            )}
          </div>

          <div className="request-item-side">
            <strong>{formatCurrency(item.amount)}</strong>

            {isIncoming && isPending && (
                <>
                  <button
                      type="button"
                      className="request-accept-button"
                      disabled={actionId === item.id}
                      onClick={() => handleAccept(item.id)}
                  >
                    {actionId === item.id
                        ? "Please wait..."
                        : "Accept"}
                  </button>

                  <button
                      type="button"
                      className="request-reject-button"
                      disabled={actionId === item.id}
                      onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </button>
                </>
            )}
          </div>
        </article>
    );
  };

  return (
      <main className="request-page">
        {/* HEADER */}
        <header className="request-header">
          <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
          >
            ←
          </button>

          <div>
            <h2>Request Money</h2>
            <p>Ask someone to pay you</p>
          </div>
        </header>

        {/* HERO */}
        <section className="request-hero">
          <div className="request-hero-icon">₹</div>

          <h1>Receive with ease.</h1>

          <p>
            Create a payment request for another PayWave user.
          </p>

          <div className="request-stats">
            <div>
              <strong>{requests.length}</strong>
              <span>Total Requests</span>
            </div>

            <div>
              <strong>{pendingIncoming.length}</strong>
              <span>Incoming Pending</span>
            </div>

            <div>
              <strong>{outgoingRequests.length}</strong>
              <span>Sent Requests</span>
            </div>
          </div>
        </section>

        {/* CREATE REQUEST */}
        <form className="request-card" onSubmit={handleRequest}>
          <h3>Create a request</h3>

          <p className="request-form-description">
            Enter the PayWave ID of the person you want to
            request money from.
          </p>

          <label htmlFor="request-paywave-id">
            Payer's PayWave ID
          </label>

          <input
              id="request-paywave-id"
              type="text"
              value={paywaveId}
              onChange={(e) => setPaywaveId(e.target.value)}
              placeholder="e.g. PW123456"
              required
          />

          <label htmlFor="request-amount">
            Amount (₹)
          </label>

          <input
              id="request-amount"
              type="number"
              min="0.01"
              max="100000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
          />

          <label htmlFor="request-note">
            Note (optional)
          </label>

          <input
              id="request-note"
              type="text"
              maxLength={255}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dinner bill"
          />

          {error && (
              <p className="request-error" role="alert">
                {error}
              </p>
          )}

          {success && (
              <p className="request-success" role="status">
                {success}
              </p>
          )}

          <button
              className="request-primary"
              type="submit"
              disabled={saving || loading}
          >
            {saving
                ? "Creating request..."
                : "Create Money Request"}
          </button>
        </form>

        {/* REQUEST HISTORY */}
        <section className="request-history">
          <div className="request-history-heading">
            <div>
              <h3>Request History</h3>
              <p>
                Manage your incoming and outgoing requests.
              </p>
            </div>

            <button
                type="button"
                className="request-refresh"
                onClick={loadRequests}
                disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
              <div className="request-empty">
                Loading requests...
              </div>
          ) : requests.length === 0 ? (
              <div className="request-empty">
                <span>₹</span>
                <h3>No requests yet</h3>
                <p>Your money requests will appear here.</p>
              </div>
          ) : (
              <>
                <div className="request-group">
                  <h4>Incoming Requests</h4>

                  {incomingRequests.length === 0 ? (
                      <div className="request-empty small">
                        No incoming requests.
                      </div>
                  ) : (
                      <div className="request-list">
                        {incomingRequests.map((item) =>
                            renderRequest(item, "incoming")
                        )}
                      </div>
                  )}
                </div>

                <div className="request-group">
                  <h4>Requests Sent</h4>

                  {outgoingRequests.length === 0 ? (
                      <div className="request-empty small">
                        You haven't sent any requests.
                      </div>
                  ) : (
                      <div className="request-list">
                        {outgoingRequests.map((item) =>
                            renderRequest(item, "outgoing")
                        )}
                      </div>
                  )}
                </div>
              </>
          )}
        </section>

        <p className="request-footer">
          PayWave educational simulation. Payments are processed
          only within the application's wallet system.
        </p>
      </main>
  );
}

export default RequestMoney;
