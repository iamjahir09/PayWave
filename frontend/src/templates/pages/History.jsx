
import { useMemo, useState } from "react";
import "../../static/css/History.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

function History({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    {
      id: "PW1001",
      name: "Rahul Sharma",
      upi: "rahul@paywave",
      amount: 500,
      type: "sent",
      date: "Today",
      time: "10:30 AM",
      status: "Successful",
      note: "Lunch payment",
    },
    {
      id: "PW1002",
      name: "Aman Khan",
      upi: "aman@paywave",
      amount: 1000,
      type: "received",
      date: "Today",
      time: "09:15 AM",
      status: "Successful",
      note: "Money received",
    },
    {
      id: "PW1003",
      name: "Grocery Store",
      upi: "grocery@merchant",
      amount: 250,
      type: "sent",
      date: "Yesterday",
      time: "07:20 PM",
      status: "Successful",
      note: "Grocery purchase",
    },
    {
      id: "PW1004",
      name: "Sara Khan",
      upi: "sara@paywave",
      amount: 750,
      type: "received",
      date: "Yesterday",
      time: "05:45 PM",
      status: "Successful",
      note: "Shared expenses",
    },
    {
      id: "PW1005",
      name: "Electricity Board",
      upi: "electricity@bill",
      amount: 1200,
      type: "sent",
      date: "12 Nov 2026",
      time: "11:20 AM",
      status: "Successful",
      note: "Electricity bill",
    },
    {
      id: "PW1006",
      name: "Zoya Shaikh",
      upi: "zoya@paywave",
      amount: 350,
      type: "received",
      date: "10 Nov 2026",
      time: "02:10 PM",
      status: "Successful",
      note: "Payment received",
    },
    {
      id: "PW1007",
      name: "Mobile Recharge",
      upi: "recharge@merchant",
      amount: 299,
      type: "sent",
      date: "08 Nov 2026",
      time: "06:30 PM",
      status: "Failed",
      note: "Mobile recharge",
    },
    {
      id: "PW1008",
      name: "Kabir Patel",
      upi: "kabir@paywave",
      amount: 1500,
      type: "sent",
      date: "05 Nov 2026",
      time: "09:40 AM",
      status: "Successful",
      note: "Personal transfer",
    },
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Sent" && transaction.type === "sent") ||
        (activeFilter === "Received" && transaction.type === "received");

      const searchText = search.toLowerCase();

      const matchesSearch =
        transaction.name.toLowerCase().includes(searchText) ||
        transaction.upi.toLowerCase().includes(searchText) ||
        transaction.id.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const totalSent = transactions
    .filter((transaction) => transaction.type === "sent" && transaction.status === "Successful")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalReceived = transactions
    .filter((transaction) => transaction.type === "received" && transaction.status === "Successful")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    if (!groups[transaction.date]) {
      groups[transaction.date] = [];
    }

    groups[transaction.date].push(transaction);
    return groups;
  }, {});

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
            placeholder="Search name, UPI ID or transaction ID"
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

        {Object.keys(groupedTransactions).length > 0 ? (
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
                      <span>{transaction.type === "sent" ? "Paid" : "Received"}</span>
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
            <p>Try changing your search or filter.</p>
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

            <div className={`modal-status-icon ${selectedTransaction.status === "Successful" ? "success" : "failed"}`}>
              <PayWaveIcon
                name={selectedTransaction.status === "Successful" ? "receive" : "history"}
                size={30}
                color="#172B3A"
              />
            </div>

            <h2>
              {selectedTransaction.type === "sent" ? "Money sent" : "Money received"}
            </h2>

            <div className={`modal-amount ${selectedTransaction.type}`}>
              {selectedTransaction.type === "sent" ? "−" : "+"}
              ₹{selectedTransaction.amount.toLocaleString("en-IN")}
            </div>

            <span className={`modal-status ${selectedTransaction.status === "Successful" ? "success" : "failed"}`}>
              {selectedTransaction.status}
            </span>

            <div className="modal-details">
              <div>
                <span>To / From</span>
                <strong>{selectedTransaction.name}</strong>
              </div>

              <div>
                <span>UPI ID</span>
                <strong>{selectedTransaction.upi}</strong>
              </div>

              <div>
                <span>Date and time</span>
                <strong>{selectedTransaction.date}, {selectedTransaction.time}</strong>
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
