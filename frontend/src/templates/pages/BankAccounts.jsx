
import { useState } from "react";
import "../../static/css/BankAccounts.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

function BankAccounts({ onBack }) {
  const accounts = [
    {
      id: 1,
      bank: "State Bank of India",
      accountNumber: "4582",
      type: "Savings Account",
      balance: "₹25,840.50",
      pin: "123456",
      initials: "SBI",
    },
    {
      id: 2,
      bank: "HDFC Bank",
      accountNumber: "7821",
      type: "Savings Account",
      balance: "₹48,250.00",
      pin: "123456",
      initials: "H",
    },
    {
      id: 3,
      bank: "ICICI Bank",
      accountNumber: "2190",
      type: "Savings Account",
      balance: "₹12,600.75",
      pin: "123456",
      initials: "IC",
    },
  ];

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  const handleCheckBalance = (account) => {
    setSelectedAccount(account);
    setPin("");
    setError("");
    setVerified(false);
    setBalanceVisible(false);
  };

  const handlePinSubmit = (event) => {
    event.preventDefault();

    if (!selectedAccount || pin.length !== 6) {
      setError("Please enter your 6-digit PIN.");
      return;
    }

    if (pin !== selectedAccount.pin) {
      setError("Incorrect UPI PIN. Please try again.");
      setPin("");
      return;
    }

    setVerified(true);
    setBalanceVisible(true);
    setError("");
    setPin("");
  };

  const handleBack = () => {
    if (selectedAccount) {
      setSelectedAccount(null);
      setPin("");
      setError("");
      setVerified(false);
      setBalanceVisible(false);
    } else {
      onBack();
    }
  };

  return (
    <main className="bank-page">
      <header className="bank-page-header">
        <button
          type="button"
          className="bank-back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h1>{selectedAccount ? "Account Verification" : "Bank Accounts"}</h1>
          <p>
            {selectedAccount
              ? "Verify your account securely"
              : "Your linked bank accounts"}
          </p>
        </div>

        <div className="bank-header-mark">
          <PayWaveIcon name="bank" size={23} color="#FFAD55" />
        </div>
      </header>

      {!selectedAccount ? (
        <>
          <section className="bank-intro">
            <span className="bank-eyebrow">YOUR MONEY SPACE</span>
            <h2>All your accounts, in one place.</h2>
            <p>
              Choose a linked bank account to securely check its available
              balance.
            </p>
          </section>

          <section className="linked-accounts-section">
            <div className="linked-accounts-heading">
              <h3>Linked Accounts</h3>
              <span>{accounts.length} ACCOUNTS</span>
            </div>

            <div className="linked-accounts-list">
              {accounts.map((account) => (
                <article className="linked-bank-card" key={account.id}>
                  <div className="linked-bank-top">
                    <div className="linked-bank-logo">
                      <PayWaveIcon name="bank" size={25} color="#F28C28" />
                    </div>

                    <span className="linked-bank-status">
                      <span></span>
                      LINKED
                    </span>
                  </div>

                  <h4>{account.bank}</h4>
                  <p className="linked-account-type">{account.type}</p>

                  <div className="linked-account-number">
                    <span>Account Number</span>
                    <strong>•••• {account.accountNumber}</strong>
                  </div>

                  <button
                    type="button"
                    className="bank-check-button"
                    onClick={() => handleCheckBalance(account)}
                  >
                    <PayWaveIcon
                      name="security"
                      size={19}
                      color="#172B3A"
                    />
                    Check Balance
                    <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          <div className="bank-security-note">
            <PayWaveIcon name="security" size={20} color="#16865C" />
            <p>
              Your account balance remains private until you verify your
              selected account.
            </p>
          </div>
        </>
      ) : (
        <section className="account-verification">
          <div className="selected-bank-card">
            <div className="selected-bank-logo">
              <PayWaveIcon name="bank" size={29} color="#FFAD55" />
            </div>

            <div>
              <h3>{selectedAccount.bank}</h3>
              <p>Account ending •••• {selectedAccount.accountNumber}</p>
            </div>
          </div>

          {!verified ? (
            <form className="upi-pin-card" onSubmit={handlePinSubmit}>
              <div className="pin-security-icon">
                <PayWaveIcon name="security" size={32} color="#F28C28" />
              </div>

              <span className="bank-eyebrow">SECURE VERIFICATION</span>
              <h2>Enter your UPI PIN</h2>

              <p>
                Enter the 6-digit simulated UPI PIN for this bank account
                to view its balance.
              </p>

              <label htmlFor="bankUpiPin">6-digit UPI PIN</label>

              <input
                id="bankUpiPin"
                className="upi-pin-input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                placeholder="• • • • • •"
                value={pin}
                onChange={(event) => {
                  setPin(event.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                autoFocus
                required
              />

              {error && <p className="bank-pin-error">{error}</p>}

              <button
                type="submit"
                className="verify-pin-button"
                disabled={pin.length !== 6}
              >
                Verify & Check Balance
                <span>→</span>
              </button>

              <div className="pin-privacy-note">
                <PayWaveIcon name="security" size={16} color="#16865C" />
                <span>Your PIN is used only for this demo verification.</span>
              </div>

              <p className="demo-pin-hint">
                Demo testing PIN: 123456
              </p>
            </form>
          ) : (
            <div className="balance-result-card">
              <div className="balance-result-top">
                <span>ACCOUNT BALANCE</span>
                <span className="balance-verified">
                  <span></span>
                  VERIFIED
                </span>
              </div>

              <div className="balance-result-icon">
                <PayWaveIcon name="wallet" size={30} color="#FFAD55" />
              </div>

              <p>Available Balance</p>

              <h2>
                {balanceVisible
                  ? selectedAccount.balance
                  : "₹ ••••••"}
              </h2>

              <div className="balance-result-divider"></div>

              <div className="balance-result-bank">
                <span>{selectedAccount.bank}</span>
                <span>•••• {selectedAccount.accountNumber}</span>
              </div>

              <button
                type="button"
                className="hide-balance-button"
                onClick={() => setBalanceVisible((previous) => !previous)}
              >
                <PayWaveIcon
                  name="security"
                  size={18}
                  color="#172B3A"
                />
                {balanceVisible ? "Hide Balance" : "Show Balance"}
              </button>

              <p className="balance-demo-note">
                This is a simulated demo balance, not a real bank balance.
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default BankAccounts;
