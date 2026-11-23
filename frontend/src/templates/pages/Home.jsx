
import { useCallback, useEffect, useState } from "react";
import "../../static/css/Home.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import {
  getMyWallet,
  getTransactionHistory,
} from "../services/paywaveApi";

function Home({
                user,
                onOpenBankAccounts,
                onOpenHistory,
                onOpenWallet,
                onOpenProfile,
                onOpenSendMoney,
                onOpenReceiveMoney,
                onOpenScanQR,
                onOpenService,
                onOpenSplitExpenses,
                onOpenRequestMoney,
                onOpenPaymentReminders,
              }) {
  const displayName = user?.name || "PayWave User";

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [walletError, setWalletError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const getErrorMessage = (error) =>
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

  // Fetch wallet balance
  const loadWallet = useCallback(async () => {
    try {
      setWalletError("");
      const response = await getMyWallet();
      setWallet(response.data);
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setWalletLoading(false);
    }
  }, []);

  // Fetch transaction history
  const loadTransactions = useCallback(async () => {
    try {
      setTransactionError("");

      const response = await getTransactionHistory();

      const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || response.data?.data || [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      setTransactionError(getErrorMessage(error));
    } finally {
      setTransactionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, [loadWallet, loadTransactions]);

  // Currency formatter
  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // Date formatter
  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Transaction information
  const getTransactionDetails = (transaction) => {
    const type = String(transaction.type || "").toUpperCase();

    const isAddMoney = type === "ADD_MONEY";
    const isSent = type === "SEND";

    const name = isAddMoney
        ? "Wallet Top-up"
        : isSent
            ? transaction.receiverName || "Unknown receiver"
            : transaction.senderName || "Unknown sender";

    return {
      name,
      isCredit: isAddMoney || type === "RECEIVE",
    };
  };

  const recentTransactions = [...transactions]
      .sort(
          (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
      )
      .slice(0, 4);

  // Quick actions
  const quickActions = [
    {
      name: "Send Money",
      icon: "send",
      style: "send",
      action: onOpenSendMoney,
    },
    {
      name: "Receive",
      icon: "receive",
      style: "receive",
      action: onOpenReceiveMoney,
    },
    {
      name: "Scan QR",
      icon: "scan",
      style: "scan",
      action: onOpenScanQR,
    },
    {
      name: "Bank Account",
      icon: "bank",
      style: "bank",
      action: onOpenBankAccounts,
    },
  ];

  // Everyday payments
  const everydayPayments = [
    { icon: "mobile", name: "Mobile Recharge", color: "orange" },
    { icon: "electricity", name: "Electricity", color: "yellow" },
    { icon: "television", name: "DTH Recharge", color: "purple" },
    { icon: "water", name: "Water Bill", color: "blue" },
  ];

  // PayWave features
  const features = [
    {
      title: "Split Expenses",
      description: "Divide bills with your friends",
      icon: "split",
      style: "expense-icon",
      action: onOpenSplitExpenses,
    },
    {
      title: "Request Money",
      description: "Request payments from people",
      icon: "request",
      style: "request-icon",
      action: onOpenRequestMoney,
    },
    {
      title: "Payment Reminders",
      description: "Keep track of upcoming payments",
      icon: "reminder",
      style: "schedule-icon",
      action: onOpenPaymentReminders,
    },
  ];

  return (
      <main className="home-page">

        {/* HEADER */}
        <header className="home-header">
          <div>
            <h1>
              PayWave<span>.</span>
            </h1>
            <p>Good day, {displayName.split(" ")[0]} 👋</p>
          </div>

          <button
              className="profile-button"
              onClick={onOpenProfile}
              title="My Profile"
              aria-label="My Profile"
          >
            {displayName.charAt(0).toUpperCase()}
          </button>
        </header>

        {/* WALLET BALANCE */}
        <section className="home-wallet-card">
          <div className="home-wallet-top">
            <span>YOUR PAYWAVE BALANCE</span>
            <PayWaveIcon
                name="wallet"
                size={24}
                color="#FFAD55"
            />
          </div>

          {walletLoading ? (
              <h2 className="home-wallet-amount">
                Loading balance...
              </h2>
          ) : walletError ? (
              <div className="home-wallet-error">
                <span>{walletError}</span>
                <button type="button" onClick={loadWallet}>
                  Retry
                </button>
              </div>
          ) : (
              <h2 className="home-wallet-amount">
                {formatCurrency(
                    wallet?.balance,
                    wallet?.currency || "INR"
                )}
              </h2>
          )}

          <div className="home-wallet-bottom">


            <button type="button" onClick={onOpenWallet}>
              View Wallet →
            </button>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="quick-actions">
          <div className="section-heading">
            <h3>Quick Actions</h3>
            <span>PAYMENTS</span>
          </div>

          <div className="action-grid">
            {quickActions.map((action) => (
                <button
                    className="action-item"
                    key={action.name}
                    type="button"
                    onClick={action.action}
                >
              <span className={`action-icon ${action.style}-icon`}>
                <PayWaveIcon
                    name={action.icon}
                    size={30}
                    color="#172B3A"
                />
              </span>

                  <span>{action.name}</span>
                </button>
            ))}
          </div>
        </section>

        {/* EVERYDAY PAYMENTS */}
        <section className="everyday-section">
          <div className="section-heading">
            <h3>Everyday Payments</h3>
            <span>DAILY SERVICES</span>
          </div>

          <div className="everyday-grid">
            {everydayPayments.map((item) => (
                <button
                    className="everyday-item"
                    key={item.name}
                    type="button"
                    onClick={() => onOpenService(item.name)}
                >
                  <div className={`everyday-icon ${item.color}`}>
                    <PayWaveIcon
                        name={item.icon}
                        size={30}
                        color="#172B3A"
                    />
                  </div>

                  <span>{item.name}</span>
                </button>
            ))}
          </div>
        </section>

        {/* RECENT TRANSACTIONS */}
        <section className="home-recent-section">
          <div className="section-heading">
            <h3>Recent Transactions</h3>

            <button
                className="home-see-all"
                type="button"
                onClick={onOpenHistory}
            >
              See all
            </button>
          </div>

          {transactionLoading ? (
              <div className="home-transactions-state">
                Loading transactions...
              </div>
          ) : transactionError ? (
              <div className="home-transactions-state home-transactions-error">
                <span>{transactionError}</span>

                <button
                    type="button"
                    onClick={loadTransactions}
                >
                  Retry
                </button>
              </div>
          ) : recentTransactions.length === 0 ? (
              <div className="home-transactions-state">
                No transactions yet. Your recent activity will appear here.
              </div>
          ) : (
              <div className="home-transactions-card">
                {recentTransactions.map((transaction, index) => {
                  const details =
                      getTransactionDetails(transaction);

                  const successful =
                      String(transaction.status || "").toUpperCase() ===
                      "SUCCESS";

                  return (
                      <div
                          className="home-transaction-row"
                          key={
                              transaction.transactionReference ||
                              transaction.id ||
                              index
                          }
                      >
                        <div
                            className={`home-transaction-icon ${
                                details.isCredit ? "credit" : "debit"
                            }`}
                        >
                          <PayWaveIcon
                              name={details.isCredit ? "receive" : "send"}
                              size={19}
                              color={
                                details.isCredit ? "#16865C" : "#D66E25"
                              }
                          />
                        </div>

                        <div className="home-transaction-info">
                          <strong>{details.name}</strong>

                          <span>
                      {formatDate(transaction.createdAt)} ·{" "}
                            {successful
                                ? "Successful"
                                : transaction.status || "Status unavailable"}
                    </span>
                        </div>

                        <strong
                            className={`home-transaction-amount ${
                                details.isCredit ? "credit" : "debit"
                            }`}
                        >
                          {details.isCredit ? "+" : "−"}
                          {formatCurrency(
                              transaction.amount,
                              transaction.currency || "INR"
                          )}
                        </strong>
                      </div>
                  );
                })}
              </div>
          )}
        </section>

        {/* PAYWAVE FEATURES */}
        <section className="features-section">
          <div className="section-heading">
            <h3>PayWave Features</h3>
            <span>EXPLORE</span>
          </div>

          <div className="features-card">
            {features.map((feature) => (
                <button
                    className="feature-item"
                    type="button"
                    key={feature.title}
                    onClick={feature.action}
                >
                  <div className={`feature-icon ${feature.style}`}>
                    <PayWaveIcon
                        name={feature.icon}
                        size={29}
                        color="#172B3A"
                    />
                  </div>

                  <div className="feature-info">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>

                  <span className="feature-arrow">›</span>
                </button>
            ))}
          </div>
        </section>

        {/* PAYWAVE SPOTLIGHT */}
        <section className="spotlight-section">
          <div className="spotlight-card">
            <div className="spotlight-content">
              <span>PAYWAVE SPOTLIGHT</span>

              <h3>Stay one step ahead.</h3>

              <p>
                Never share your payment PIN with anyone.
                Keep your money and account secure.
              </p>
            </div>

            <div className="spotlight-symbol">
              <PayWaveIcon
                  name="security"
                  size={43}
                  color="#FFAD55"
              />
            </div>
          </div>
        </section>
      </main>
  );
}

export default Home;
