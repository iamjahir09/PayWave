
import { useEffect, useMemo, useState } from "react";
import "../../static/css/History.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import { getTransactionHistory } from "../services/paywaveApi";
import { getApiError } from "../services/apiClient";

function History({ onBack }) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getTransactionHistory();

                if (!active) return;

                const data = Array.isArray(response.data) ? response.data : [];

                const formatted = data.map((item) => {
                    const type = String(item.type || "").toUpperCase();
                    const isSent = type === "SEND";
                    const isAddMoney = type === "ADD_MONEY";

                    const dateObject = item.createdAt
                        ? new Date(item.createdAt)
                        : null;

                    return {
                        id: item.transactionReference,
                        name: isAddMoney
                            ? "Wallet Top-up"
                            : isSent
                                ? item.receiver || "Unknown receiver"
                                : item.sender || "Unknown sender",
                        amount: Number(item.amount || 0),
                        currency: item.currency || "INR",
                        type: isSent ? "sent" : "received",
                        date: dateObject && !Number.isNaN(dateObject.getTime())
                            ? dateObject.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "Date unavailable",
                        time: dateObject && !Number.isNaN(dateObject.getTime())
                            ? dateObject.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "",
                        status: String(item.status || "").toUpperCase() === "SUCCESS"
                            ? "Successful"
                            : String(item.status || "PENDING").toUpperCase(),
                        note: isAddMoney
                            ? "Money added to wallet"
                            : isSent
                                ? "Money sent"
                                : "Money received",
                        upi: "",
                    };
                });

                setTransactions(formatted);
            } catch (err) {
                if (active) {
                    setError(getApiError(err));
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            active = false;
        };
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Sent" && transaction.type === "sent") ||
                (activeFilter === "Received" && transaction.type === "received");

            const searchText = search.toLowerCase();

            const matchesSearch =
                transaction.name.toLowerCase().includes(searchText) ||
                transaction.id.toLowerCase().includes(searchText);

            return matchesFilter && matchesSearch;
        });
    }, [transactions, activeFilter, search]);

    const totalSent = transactions
        .filter((transaction) =>
            transaction.type === "sent" &&
            transaction.status === "Successful"
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

    const totalReceived = transactions
        .filter((transaction) =>
            transaction.type === "received" &&
            transaction.status === "Successful"
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

    const groupedTransactions = filteredTransactions.reduce(
        (groups, transaction) => {
            if (!groups[transaction.date]) {
                groups[transaction.date] = [];
            }

            groups[transaction.date].push(transaction);
            return groups;
        },
        {}
    );

    return (
        <main className="history-page">

            <header className="history-header">
                <button className="history-back" onClick={onBack} type="button">
                    <span>‹</span>
                </button>

                <div>
                    <h1>Transaction History</h1>
                    <p>Your complete payment activity</p>
                </div>

                <div className="history-header-icon">
                    <PayWaveIcon name="history" size={25} />
                </div>
            </header>

            <section className="history-summary">
                <div className="history-summary-top">
                    <span>TRANSACTION OVERVIEW</span>
                    <span>{transactions.length} RECORDS</span>
                </div>

                <div className="history-summary-grid">
                    <div>
                        <span className="summary-label">Total Sent</span>
                        <h2>₹{totalSent.toLocaleString("en-IN")}</h2>
                    </div>

                    <div>
                        <span className="summary-label">Total Received</span>
                        <h2>₹{totalReceived.toLocaleString("en-IN")}</h2>
                    </div>
                </div>

                <div className="history-summary-footer">
                    <span>All amounts are simulated</span>
                    <PayWaveIcon name="security" size={19} color="#FFAD55" />
                </div>
            </section>

            <section className="history-transactions">
                <div className="history-title-row">
                    <div>
                        <span className="home-eyebrow">YOUR ACTIVITY</span>
                        <h2>Transactions</h2>
                    </div>

                    <span className="history-count">
            {filteredTransactions.length} found
          </span>
                </div>

                <div className="history-search">
                    <PayWaveIcon name="upi" size={22} color="#77838D" />

                    <input
                        type="text"
                        placeholder="Search name or transaction ID"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    {search && (
                        <button type="button" onClick={() => setSearch("")}>
                            ×
                        </button>
                    )}
                </div>

                <div className="history-filters">
                    {["All", "Sent", "Received"].map((filter) => (
                        <button
                            type="button"
                            key={filter}
                            className={activeFilter === filter ? "selected" : ""}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="history-empty">
                        <p>Loading transactions...</p>
                    </div>
                ) : error ? (
                    <div className="history-empty">
                        <h3>Unable to load transactions</h3>
                        <p>{error}</p>
                    </div>
                ) : Object.keys(groupedTransactions).length > 0 ? (
                    Object.entries(groupedTransactions).map(([date, items]) => (
                        <section className="history-date-group" key={date}>
                            <h3>{date}</h3>

                            <div className="history-list">
                                {items.map((transaction) => (
                                    <button
                                        type="button"
                                        className="history-transaction"
                                        key={transaction.id}
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        <div className={`history-transaction-icon ${transaction.type}`}>
                                            <PayWaveIcon
                                                name={transaction.type === "sent" ? "send" : "receive"}
                                                size={24}
                                                color="#172B3A"
                                            />
                                        </div>

                                        <div className="history-transaction-info">
                                            <strong>{transaction.name}</strong>
                                            <span>{transaction.time}</span>
                                            <small>{transaction.status}</small>
                                        </div>

                                        <div className="history-transaction-amount">
                                            <strong className={transaction.type}>
                                                {transaction.type === "sent" ? "−" : "+"}
                                                ₹{transaction.amount.toLocaleString("en-IN")}
                                            </strong>
                                            <span>
                        {transaction.type === "sent" ? "Paid" : "Received"}
                      </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="history-empty">
                        <PayWaveIcon name="history" size={38} color="#A0A8AD" />
                        <h3>No transactions found</h3>
                        <p>Your completed payment activity will appear here.</p>
                    </div>
                )}
            </section>

            {selectedTransaction && (
                <div
                    className="transaction-modal-overlay"
                    onClick={() => setSelectedTransaction(null)}
                >
                    <section
                        className="transaction-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="transaction-modal-close"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            ×
                        </button>

                        <div className="modal-status-icon success">
                            <PayWaveIcon
                                name="history"
                                size={30}
                                color="#172B3A"
                            />
                        </div>

                        <h2>
                            {selectedTransaction.type === "sent"
                                ? "Money sent"
                                : "Money received"}
                        </h2>

                        <div className={`modal-amount ${selectedTransaction.type}`}>
                            {selectedTransaction.type === "sent" ? "−" : "+"}
                            ₹{selectedTransaction.amount.toLocaleString("en-IN")}
                        </div>

                        <span className={`modal-status ${
                            selectedTransaction.status === "Successful" ? "success" : "failed"
                        }`}>
              {selectedTransaction.status}
            </span>

                        <div className="modal-details">
                            <div>
                                <span>To / From</span>
                                <strong>{selectedTransaction.name}</strong>
                            </div>

                            <div>
                                <span>Date and time</span>
                                <strong>
                                    {selectedTransaction.date}, {selectedTransaction.time}
                                </strong>
                            </div>

                            <div>
                                <span>Transaction ID</span>
                                <strong>{selectedTransaction.id}</strong>
                            </div>

                            <div>
                                <span>Note</span>
                                <strong>{selectedTransaction.note}</strong>
                            </div>
                        </div>

                        <p className="modal-demo-note">
                            This is a simulated PayWave transaction.
                        </p>

                        <button
                            type="button"
                            className="modal-done-button"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            Done
                        </button>
                    </section>
                </div>
            )}

            <p className="history-disclaimer">
                PayWave is an educational payment simulation.
                No real money is transferred.
            </p>

        </main>
    );
}

export default History;
