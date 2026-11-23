
import { useCallback, useEffect, useState } from "react";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import {
    getMyWallet,
    addMoney,
    getTransactionHistory,
} from "../services/paywaveApi";
import "../../static/css/Wallet.css";

function Wallet({ onBack }) {
    const [showBalance, setShowBalance] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState("");

    const [wallet, setWallet] = useState(null);
    const [walletActivity, setWalletActivity] = useState([]);

    const [loading, setLoading] = useState(true);
    const [addingMoney, setAddingMoney] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch wallet balance
    const fetchWallet = useCallback(async () => {
        const response = await getMyWallet();
        setWallet(response.data);
    }, []);

    // Fetch transaction history
    const fetchWalletActivity = useCallback(async () => {
        const response = await getTransactionHistory();

        const transactions = Array.isArray(response.data)
            ? response.data
            : response.data?.content || [];

        setWalletActivity(transactions);
    }, []);

    // Initial data loading
    const loadWalletData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            await Promise.all([
                fetchWallet(),
                fetchWalletActivity(),
            ]);
        } catch (err) {
            console.error("Wallet loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load wallet details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [fetchWallet, fetchWalletActivity]);

    useEffect(() => {
        loadWalletData();
    }, [loadWalletData]);

    // Currency formatter
    const formatAmount = (value) => {
        return Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Date formatter
    const formatDate = (dateValue) => {
        if (!dateValue) return "Date unavailable";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Convert transaction response into wallet activity
    const formatTransaction = (transaction) => {
        const transactionType = String(
            transaction.type || transaction.transactionType || ""
        ).toUpperCase();

        const isCredit =
            transactionType === "ADD_MONEY" ||
            transactionType === "RECEIVE";

        let title = "Wallet transaction";
        let subtitle = "PayWave transaction";

        if (transactionType === "ADD_MONEY") {
            title = "Money added";
            subtitle = "Added to PayWave Wallet";
        } else if (transactionType === "SEND") {
            title = "Money sent";
            subtitle = `To ${transaction.receiverName || "User"}`;
        } else if (transactionType === "RECEIVE") {
            title = "Money received";
            subtitle = `From ${transaction.senderName || "User"}`;
        }

        return {
            id: transaction.transactionReference || transaction.id,
            title,
            subtitle,
            date: formatDate(transaction.createdAt),
            amount: Number(transaction.amount || 0),
            type: isCredit ? "credit" : "debit",
            status: transaction.status || transaction.transactionStatus,
        };
    };

    // Add money through backend
    const handleAddMoney = async (e) => {
        e.preventDefault();

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 1) {
            setMessage("Please enter a valid amount.");
            return;
        }

        if (value > 100000) {
            setMessage("Maximum demo top-up amount is ₹1,00,000.");
            return;
        }

        setAddingMoney(true);
        setMessage("");

        try {
            const response = await addMoney(value);

            // Update balance from backend response
            setWallet(response.data);

            // Refresh activity after successful top-up
            await fetchWalletActivity();

            setAmount("");
            setShowAddMoney(false);
            setMessage("Money added successfully!");
        } catch (err) {
            console.error("Add money error:", err);

            setMessage(
                err.response?.data?.message ||
                "Unable to add money. Please try again."
            );
        } finally {
            setAddingMoney(false);
        }
    };

    const currency = wallet?.currency || "INR";

    const currencySymbol = currency === "INR" ? "₹" : currency;

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

                {loading ? (
                    <div className="wallet-message">
                        Loading wallet details...
                    </div>
                ) : error ? (
                    <div className="wallet-message">
                        {error}
                        <button onClick={loadWalletData}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Wallet Balance */}
                        <section className="wallet-balance-card">
                            <div className="wallet-balance-top">
                                <div>
                                    <span className="wallet-card-label">
                                        TOTAL WALLET BALANCE
                                    </span>

                                    <div className="wallet-balance-value">
                                        {showBalance
                                            ? `${currencySymbol}${formatAmount(wallet?.balance)}`
                                            : "₹ ••••••"}
                                    </div>
                                </div>

                                <button
                                    className="wallet-eye-button"
                                    onClick={() =>
                                        setShowBalance(!showBalance)
                                    }
                                    aria-label={
                                        showBalance
                                            ? "Hide balance"
                                            : "Show balance"
                                    }
                                >
                                    {showBalance ? "Hide" : "Show"}
                                </button>
                            </div>

                            <div className="wallet-card-bottom">
                                <div>

                                </div>

                                <div className="wallet-card-logo">
                                    <PayWaveIcon name="upi" />
                                    <span>PayWave</span>
                                </div>
                            </div>
                        </section>

                        {/* Wallet Actions */}
                        <div className="wallet-action-row">
                            <button
                                className="wallet-action-button add"
                                onClick={() => {
                                    setMessage("");
                                    setShowAddMoney(true);
                                }}
                            >
                                <span className="wallet-action-icon">
                                    ＋
                                </span>
                                <strong>Add Money</strong>
                                <small>Add funds to wallet</small>
                            </button>

                            <button
                                className="wallet-action-button history"
                                onClick={() => {
                                    document
                                        .getElementById("wallet-activity")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            >
                                <span className="wallet-action-icon">
                                    ↗
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

                        {/* Linked Bank Account */}
                        <section className="wallet-section">
                            <div className="wallet-section-heading">
                                <div>
                                    <h2>Linked Bank Account</h2>
                                    <p>Your linked payment accounts</p>
                                </div>
                            </div>

                            <div className="wallet-bank-card">
                                <div className="wallet-bank-icon">
                                    <PayWaveIcon name="bank" />
                                </div>

                                <div className="wallet-bank-details">
                                    <strong>Manage Bank Accounts</strong>
                                    <span>
                                        View your linked bank accounts
                                    </span>
                                    <small>
                                        Bank details are managed separately
                                    </small>
                                </div>
                            </div>

                            <p className="wallet-bank-note">
                                Add and manage your bank accounts from the
                                Bank Accounts section.
                            </p>
                        </section>

                        {/* Wallet Activity */}
                        <section
                            className="wallet-section"
                            id="wallet-activity"
                        >
                            <div className="wallet-section-heading">
                                <div>
                                    <h2>Wallet Activity</h2>
                                    <p>Your recent wallet transactions</p>
                                </div>

                                <span className="wallet-view-all">
                                    Recent
                                </span>
                            </div>

                            <div className="wallet-activity-list">
                                {walletActivity.length === 0 ? (
                                    <p className="wallet-bank-note">
                                        No wallet transactions found.
                                    </p>
                                ) : (
                                    walletActivity.map((transaction) => {
                                        const item =
                                            formatTransaction(transaction);

                                        return (
                                            <div
                                                className="wallet-activity-item"
                                                key={item.id}
                                            >
                                                <div
                                                    className={`wallet-activity-icon ${item.type}`}
                                                >
                                                    {item.type === "credit"
                                                        ? "↓"
                                                        : "↑"}
                                                </div>

                                                <div className="wallet-activity-details">
                                                    <strong>
                                                        {item.title}
                                                    </strong>

                                                    <span>
                                                        {item.subtitle}
                                                    </span>

                                                    <small>
                                                        {item.date}
                                                    </small>
                                                </div>

                                                <strong
                                                    className={`wallet-activity-amount ${item.type}`}
                                                >
                                                    {item.type === "credit"
                                                        ? "+"
                                                        : "-"}
                                                    {currencySymbol}
                                                    {formatAmount(item.amount)}
                                                </strong>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        {/* Security */}
                        <section className="wallet-security-card">
                            <div className="wallet-security-icon">
                                <PayWaveIcon name="security" />
                            </div>

                            <div>
                                <h3>Your wallet, your control</h3>
                                <p>
                                    Keep your account secure. Never share your
                                    MPIN or payment PIN with anyone.
                                </p>
                            </div>
                        </section>

                        <p className="wallet-disclaimer">
                            PayWave Wallet is currently a demonstration
                            feature. No real money is added, stored, or
                            transferred.
                        </p>
                    </>
                )}
            </main>

            {/* Add Money Modal */}
            {showAddMoney && (
                <div
                    className="wallet-modal-overlay"
                    onClick={() => {
                        if (!addingMoney) setShowAddMoney(false);
                    }}
                >
                    <div
                        className="wallet-add-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="wallet-modal-close"
                            onClick={() => setShowAddMoney(false)}
                            disabled={addingMoney}
                        >
                            ×
                        </button>

                        <div className="wallet-modal-icon">＋</div>

                        <h2>Add Money</h2>

                        <p>
                            Enter an amount to simulate a wallet top-up.
                        </p>

                        <form onSubmit={handleAddMoney}>
                            <label htmlFor="walletAmount">
                                Amount
                            </label>

                            <div className="wallet-amount-input">
                                <span>₹</span>

                                <input
                                    id="walletAmount"
                                    type="number"
                                    min="1"
                                    max="100000"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    disabled={addingMoney}
                                    autoFocus
                                />
                            </div>

                            <div className="wallet-quick-amounts">
                                {[500, 1000, 2000, 5000].map((value) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() =>
                                            setAmount(String(value))
                                        }
                                        disabled={addingMoney}
                                    >
                                        ₹{value.toLocaleString("en-IN")}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="wallet-add-submit"
                                type="submit"
                                disabled={addingMoney}
                            >
                                {addingMoney
                                    ? "Processing..."
                                    : "Add to Demo Wallet"}
                            </button>
                        </form>

                        <small className="wallet-modal-note">
                            Demo only — this will not debit your bank
                            account.
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Wallet;
