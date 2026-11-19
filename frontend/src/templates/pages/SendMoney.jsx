
import { useState } from "react";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import "../../static/css/SendMoney.css";

function SendMoney({ onBack }) {
  const [step, setStep] = useState("recipient");

  const [recipient, setRecipient] = useState({
    name: "",
    identifier: "",
  });

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const demoContacts = [
    { name: "Aman Khan", number: "9123456780", initial: "A" },
    { name: "Rahul Sharma", number: "9876543210", initial: "R" },
    { name: "Sara Khan", number: "9988776655", initial: "S" },
    { name: "Arjun Mehta", number: "9876501234", initial: "A" },
    { name: "Zoya Shaikh", number: "8765432109", initial: "Z" },
  ];

  const handleSelectContact = (contact) => {
    setRecipient({
      name: contact.name,
      identifier: contact.number,
    });

    setError("");
  };

  const handleContinueRecipient = () => {
    const identifier = recipient.identifier.trim();

    if (!identifier) {
      setError("Please enter a mobile number or UPI ID.");
      return;
    }

    if (!recipient.name) {
      setRecipient((previous) => ({
        ...previous,
        name: identifier.includes("@")
          ? identifier.split("@")[0]
          : "PayWave User",
      }));
    }

    if (
      !identifier.includes("@") &&
      !/^\d{10}$/.test(identifier)
    ) {
      setError("Enter a valid 10-digit mobile number or UPI ID.");
      return;
    }

    setError("");
    setStep("amount");
  };

  const handleContinueAmount = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount > 100000) {
      setError("Demo payments are limited to ₹1,00,000.");
      return;
    }

    setError("");
    setStep("review");
  };

  const handleContinueReview = () => {
    setError("");
    setPin("");
    setStep("pin");
  };

  const handlePayment = () => {
    if (pin.length !== 4) {
      setError("Enter a 4-digit demo PIN.");
      return;
    }

    // Demo-only PIN. No real payment or bank authorization.
    if (pin !== "1234") {
      setError("Incorrect demo PIN. Try again.");
      setPin("");
      return;
    }

    setError("");
    setStep("success");
  };

  const handleNewPayment = () => {
    setRecipient({ name: "", identifier: "" });
    setAmount("");
    setNote("");
    setPin("");
    setError("");
    setStep("recipient");
  };

  const goBack = () => {
    setError("");

    if (step === "recipient") {
      onBack();
    } else if (step === "amount") {
      setStep("recipient");
    } else if (step === "review") {
      setStep("amount");
    } else if (step === "pin") {
      setStep("review");
    } else {
      onBack();
    }
  };

  return (
    <main className="send-money-page">
      {/* Header */}
      <header className="send-header">
        <button
          className="send-back-button"
          onClick={goBack}
          type="button"
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h1>Send Money</h1>
          <p>Fast, simple and secure payments</p>
        </div>

        <div className="send-header-icon">
          <PayWaveIcon name="send" size={23} />
        </div>
      </header>

      {/* Progress */}
      {step !== "success" && (
        <div className="send-progress">
          {["recipient", "amount", "review", "pin"].map(
            (item, index) => {
              const steps = [
                "recipient",
                "amount",
                "review",
                "pin",
              ];

              const currentIndex = steps.indexOf(step);

              return (
                <div
                  key={item}
                  className={`send-progress-item ${
                    index <= currentIndex ? "active" : ""
                  }`}
                />
              );
            }
          )}
        </div>
      )}

      {/* Recipient Step */}
      {step === "recipient" && (
        <section className="send-content">
          <div className="send-intro">
            <span className="send-eyebrow">STEP 01</span>
            <h2>Who are you paying?</h2>
            <p>Choose a contact or enter their UPI ID.</p>
          </div>

          <div className="send-input-card">
            <label>Mobile Number or UPI ID</label>

            <input
              type="text"
              placeholder="Enter mobile number or UPI ID"
              value={recipient.identifier}
              onChange={(event) => {
                const value = event.target.value.trimStart();

                setRecipient({
                  name: "",
                  identifier: value,
                });

                setError("");
              }}
            />

            {recipient.name && (
              <div className="selected-recipient">
                <div className="send-contact-avatar">
                  {recipient.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{recipient.name}</strong>
                  <small>{recipient.identifier}</small>
                </div>

                <span>✓</span>
              </div>
            )}
          </div>

          <div className="send-contact-section">
            <div className="send-contact-heading">
              <h3>Recent Contacts</h3>
              <span>DEMO CONTACTS</span>
            </div>

            {demoContacts.map((contact) => (
              <button
                className={`send-contact-item ${
                  recipient.identifier === contact.number
                    ? "selected"
                    : ""
                }`}
                key={contact.number}
                type="button"
                onClick={() => handleSelectContact(contact)}
              >
                <div className="send-contact-avatar">
                  {contact.initial}
                </div>

                <div className="send-contact-details">
                  <strong>{contact.name}</strong>
                  <small>{contact.number}</small>
                </div>

                {recipient.identifier === contact.number && (
                  <span className="send-contact-check">✓</span>
                )}
              </button>
            ))}
          </div>

          {error && <p className="send-error">{error}</p>}

          <button
            className="send-primary-button"
            type="button"
            onClick={handleContinueRecipient}
          >
            Continue <span>→</span>
          </button>
        </section>
      )}

      {/* Amount Step */}
      {step === "amount" && (
        <section className="send-content">
          <div className="send-intro">
            <span className="send-eyebrow">STEP 02</span>
            <h2>How much to send?</h2>
            <p>Enter the amount you want to transfer.</p>
          </div>

          <div className="send-selected-user">
            <div className="send-contact-avatar">
              {recipient.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{recipient.name}</strong>
              <small>{recipient.identifier}</small>
            </div>
          </div>

          <div className="send-amount-card">
            <label>ENTER AMOUNT</label>

            <div className="send-amount-input">
              <span>₹</span>

              <input
                type="number"
                min="1"
                max="100000"
                placeholder="0"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                }}
              />
            </div>

            <div className="send-quick-amounts">
              {[100, 200, 500, 1000].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(String(value));
                    setError("");
                  }}
                >
                  + ₹{value}
                </button>
              ))}
            </div>
          </div>

          <div className="send-note-card">
            <label>ADD A NOTE (OPTIONAL)</label>

            <input
              type="text"
              placeholder="What's this payment for?"
              maxLength={60}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          {error && <p className="send-error">{error}</p>}

          <button
            className="send-primary-button"
            type="button"
            onClick={handleContinueAmount}
          >
            Continue <span>→</span>
          </button>
        </section>
      )}

      {/* Review Step */}
      {step === "review" && (
        <section className="send-content">
          <div className="send-intro">
            <span className="send-eyebrow">STEP 03</span>
            <h2>Review payment</h2>
            <p>Check the details before proceeding.</p>
          </div>

          <div className="send-review-card">
            <div className="send-review-recipient">
              <div className="send-contact-avatar large">
                {recipient.name.charAt(0).toUpperCase()}
              </div>

              <h3>{recipient.name}</h3>
              <p>{recipient.identifier}</p>
            </div>

            <div className="send-review-divider" />

            <div className="send-review-row">
              <span>Amount</span>
              <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
            </div>

            <div className="send-review-row">
              <span>Payment Note</span>
              <strong>{note || "No note added"}</strong>
            </div>

            <div className="send-review-row">
              <span>Payment Mode</span>
              <strong>PayWave Demo</strong>
            </div>

            <div className="send-review-total">
              <span>Total Amount</span>
              <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <p className="send-demo-warning">
            This is a simulated transaction. No real money will be transferred.
          </p>

          <button
            className="send-primary-button"
            type="button"
            onClick={handleContinueReview}
          >
            Proceed to PIN <span>→</span>
          </button>
        </section>
      )}

      {/* Demo PIN Step */}
      {step === "pin" && (
        <section className="send-content">
          <div className="send-intro">
            <span className="send-eyebrow">STEP 04</span>
            <h2>Enter Demo PIN</h2>
            <p>Authorize this simulated payment.</p>
          </div>

          <div className="send-pin-card">
            <div className="send-pin-icon">
              <PayWaveIcon name="security" size={32} />
            </div>

            <h3>Payment Authorization</h3>

            <p>
              Sending ₹{Number(amount).toLocaleString("en-IN")} to{" "}
              {recipient.name}
            </p>

            <label>4-DIGIT DEMO PIN</label>

            <input
              className="send-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
            />

            <small className="send-pin-hint">
              Demo PIN: 1234
            </small>
          </div>

          {error && <p className="send-error">{error}</p>}

          <button
            className="send-primary-button"
            type="button"
            onClick={handlePayment}
          >
            Confirm Payment <span>→</span>
          </button>
        </section>
      )}

      {/* Success Step */}
      {step === "success" && (
        <section className="send-content send-success-content">
          <div className="send-success-icon">
            <span>✓</span>
          </div>

          <span className="send-eyebrow">DEMO TRANSACTION COMPLETE</span>

          <h2>Payment Successful!</h2>

          <p className="send-success-subtitle">
            Your simulated payment has been completed.
          </p>

          <div className="send-success-card">
            <span>AMOUNT SENT</span>

            <h3>₹{Number(amount).toLocaleString("en-IN")}</h3>

            <div className="send-success-divider" />

            <div className="send-success-row">
              <span>To</span>
              <strong>{recipient.name}</strong>
            </div>

            <div className="send-success-row">
              <span>UPI ID / Number</span>
              <strong>{recipient.identifier}</strong>
            </div>

            <div className="send-success-row">
              <span>Note</span>
              <strong>{note || "No note"}</strong>
            </div>

            <div className="send-success-row">
              <span>Status</span>
              <strong className="send-success-status">Successful</strong>
            </div>

            <div className="send-success-row">
              <span>Mode</span>
              <strong>PayWave Demo</strong>
            </div>
          </div>

          <p className="send-demo-warning">
            Demo only. No real money was transferred.
          </p>

          <button
            className="send-primary-button"
            type="button"
            onClick={handleNewPayment}
          >
            Make Another Payment
          </button>

          <button
            className="send-secondary-button"
            type="button"
            onClick={onBack}
          >
            Back to Home
          </button>
        </section>
      )}
    </main>
  );
}

export default SendMoney;
