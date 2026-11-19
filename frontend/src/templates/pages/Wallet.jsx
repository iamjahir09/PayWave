
import { useState } from "react";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import "../../static/css/Wallet.css";

function Wallet({ onBack }) {
    const [showBalance, setShowBalance] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState("");
    const [walletBalance, setWalletBalance] = useState(12450);
    const [message, setMessage] = useState("");

    const walletActivity = [
        {
            id: "WLT1001",
            title: "Money added",
            subtitle: "Added to PayWave Wallet",
            date: "Today, 10:30 AM",
            amount: 2000,
            type: "credit",
        },
        {
            id: "WLT1002",
            title: "Cashback received",
            subtitle: "PayWave Rewards",
            date: "Yesterday, 04:15 PM",
            amount: 50,
            type: "credit",
        },
        {
            id: "WLT1003",
            title: "Wallet payment",
            subtitle: "Online payment",
            date: "17 Nov 2026, 01:20 PM",
            amount: 350,
            type: "debit",
        },
    ];

    const handleAddMoney = (e) => {
        e.preventDefault();

        const value = Number(amount);

        if (!value || value < 1) {
            setMessage("Please enter a valid amount.");
            return;
        }

        if (value > 100000) {
            setMessage("Maximum demo top-up amount is ₹1,00,000.");
            return;
        }

        setWalletBalance((previous) => previous + value);
        setAmount("");
        setMessage("Demo money added successfully!");
        setShowAddMoney(false);
    };

    return (
        <div className="wallet-page">
            <header className="wallet-header">
                <button className="wallet-back-button" onClick={onBack}>
                    <span>←</span>
                </button>

                <div>
                    <h1>My Wallet</h1>
                    <p>Manage your PayWave balance</p>
                </div>

                <div className="wallet-header-icon">
                    <PayWaveIcon name="wallet" />
                </div>
            </header>

            <main className="wallet-content">
                <section className="wallet-balance-card">
                    <div className="wallet-balance-top">
                        <div>
                            <span className="wallet-card-label">TOTAL WALLET BALANCE</span>
                            <div className="wallet-balance-value">
                                {showBalance
                                    ? `₹${walletBalance.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                    })}`
                                    : "₹ ••••••"}
                            </div>
                        </div>

                        <button
                            className="wallet-eye-button"
                            onClick={() => setShowBalance(!showBalance)}
                            aria-label={showBalance ? "Hide balance" : "Show balance"}
                        >
                            {showBalance ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="wallet-card-bottom">
                        <div>
                            <span>WALLET ID</span>
                            <strong>PW •••• 8291</strong>
                        </div>
                        <div className="wallet-card-logo">
                            <PayWaveIcon name="upi" />
                            <span>PayWave</span>
                        </div>
                    </div>
                </section>

                <div className="wallet-action-row">
                    <button
                        className="wallet-action-button add"
                        onClick={() => {
                            setMessage("");
                            setShowAddMoney(true);
                        }}
                    >
                        <span className="wallet-action-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="5" width="18" height="15" rx="3"
                                    stroke="currentColor" strokeWidth="1.7" />
                                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M12 11V17M9 14H15"
                                    stroke="currentColor" strokeWidth="1.7"
                                    strokeLinecap="round" />
                            </svg>
                        </span>
                        <strong>Add Money</strong>
                        <small>Add funds to wallet</small>
                    </button>

                    <button
                        className="wallet-action-button history"
                        onClick={() => {
                            document
                                .getElementById("wallet-activity")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        <span className="wallet-action-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M3 12A9 9 0 1 0 6 5"
                                    stroke="currentColor" strokeWidth="1.7"
                                    strokeLinecap="round" />
                                <path d="M3 4V9H8"
                                    stroke="currentColor" strokeWidth="1.7"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7V12L16 14"
                                    stroke="currentColor" strokeWidth="1.7"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <strong>Activity</strong>
                        <small>View wallet activity</small>
                    </button>
                </div>

                {message && (
                    <div className="wallet-message">
                        {message}
                    </div>
                )}

                <section className="wallet-section">
                    <div className="wallet-section-heading">
                        <div>
                            <h2>Linked Bank Account</h2>
                            <p>Your primary source of funds</p>
                        </div>
                        <span className="wallet-verified">Verified</span>
                    </div>

                    <div className="wallet-bank-card">
                        <div className="wallet-bank-icon">
                            <PayWaveIcon name="bank" />
                        </div>

                        <div className="wallet-bank-details">
                            <strong>State Bank of India</strong>
                            <span>•••• •••• 4582</span>
                            <small>Primary account</small>
                        </div>

                        <span className="wallet-bank-check">✓</span>
                    </div>

                    <p className="wallet-bank-note">
                        Bank details shown here are sample information for this demo.
                    </p>
                </section>

                <section className="wallet-section" id="wallet-activity">
                    <div className="wallet-section-heading">
                        <div>
                            <h2>Wallet Activity</h2>
                            <p>Your recent wallet transactions</p>
                        </div>
                        <span className="wallet-view-all">Recent</span>
                    </div>

                    <div className="wallet-activity-list">
                        {walletActivity.map((item) => (
                            <div className="wallet-activity-item" key={item.id}>
                                <div className={`wallet-activity-icon ${item.type}`}>
                                    {item.type === "credit" ? "↓" : "↑"}
                                </div>

                                <div className="wallet-activity-details">
                                    <strong>{item.title}</strong>
                                    <span>{item.subtitle}</span>
                                    <small>{item.date}</small>
                                </div>

                                <strong
                                    className={`wallet-activity-amount ${item.type}`}
                                >
                                    {item.type === "credit" ? "+" : "-"}₹
                                    {item.amount.toLocaleString("en-IN")}
                                </strong>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="wallet-security-card">
                    <div className="wallet-security-icon">
                        <PayWaveIcon name="security" />
                    </div>
                    <div>
                        <h3>Your wallet, your control</h3>
                        <p>
                            Keep your account secure. Never share your MPIN or payment PIN
                            with anyone.
                        </p>
                    </div>
                </section>

                <p className="wallet-disclaimer">
                    PayWave Wallet is currently a demonstration feature. No real money
                    is added, stored, or transferred.
                </p>
            </main>

            {showAddMoney && (
                <div
                    className="wallet-modal-overlay"
                    onClick={() => setShowAddMoney(false)}
                >
                    <div
                        className="wallet-add-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="wallet-modal-close"
                            onClick={() => setShowAddMoney(false)}
                        >
                            ×
                        </button>

                        <div className="wallet-modal-icon">＋</div>
                        <h2>Add Money</h2>
                        <p>Enter an amount to simulate a wallet top-up.</p>

                        <form onSubmit={handleAddMoney}>
                            <label htmlFor="walletAmount">Amount</label>

                            <div className="wallet-amount-input">
                                <span>₹</span>
                                <input
                                    id="walletAmount"
                                    type="number"
                                    min="1"
                                    max="100000"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="wallet-quick-amounts">
                                {[500, 1000, 2000, 5000].map((value) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setAmount(String(value))}
                                    >
                                        ₹{value.toLocaleString("en-IN")}
                                    </button>
                                ))}
                            </div>

                            <button className="wallet-add-submit" type="submit">
                                Add to Demo Wallet
                            </button>
                        </form>

                        <small className="wallet-modal-note">
                            Demo only — this will not debit your bank account.
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Wallet;
