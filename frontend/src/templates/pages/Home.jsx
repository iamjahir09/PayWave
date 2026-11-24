
import { useCallback, useEffect, useState } from "react";

import "../../static/css/Home.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

import {
  getTransactionHistory,
} from "../services/paywaveApi";

function Home({
  user,
  onLogout,
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
  const firstName = displayName.split(" ")[0];

  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState("");

  // =====================================
  // ERROR MESSAGE
  // =====================================

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again.";

  // =====================================
  // LOAD TRANSACTIONS
  // =====================================

  const loadTransactions = useCallback(async () => {
    try {
      setTransactionError("");

      const response = await getTransactionHistory();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ||
        response.data?.data ||
        [];

      setTransactions(Array.isArray(data) ? data : []);

    } catch (error) {
      setTransactionError(getErrorMessage(error));

    } finally {
      setTransactionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // =====================================
  // CURRENCY FORMATTER
  // =====================================

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // =====================================
  // GREETING
  // =====================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  };

  // =====================================
  // DATE FORMATTER
  // =====================================

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

  // =====================================
  // TRANSACTION DETAILS
  // =====================================

  const getTransactionDetails = (transaction) => {
    const type = String(transaction.type || "").toUpperCase();

    const isAddMoney = type === "ADD_MONEY";
    const isSent = type === "SEND";

    const name = isAddMoney
      ? "Wallet Top-up"
      : isSent
        ? transaction.receiverName ||
        transaction.receiver ||
        "Unknown receiver"
        : transaction.senderName ||
        transaction.sender ||
        "Unknown sender";

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

  // =====================================
  // UPI TRANSFER ACTIONS
  // =====================================

  const transferActions = [
    {
      name: "To Mobile",
      subtitle: "Contacts",
      icon: "mobile",
      style: "mobile",
      action: onOpenSendMoney,
    },
    {
      name: "To Bank",
      subtitle: "Account / IFSC",
      icon: "bank",
      style: "bank",
      action: onOpenSendMoney,
    },
    {
      name: "To Self",
      subtitle: "Own Accounts",
      icon: "receive",
      style: "self",
      action: onOpenBankAccounts,
    },
    {
      name: "Scan Any",
      subtitle: "QR Code",
      icon: "scan",
      style: "qr",
      action: onOpenScanQR,
    },
  ];

  // =====================================
  // RECHARGE AND BILLS
  // =====================================

  const billActions = [
    {
      name: "Mobile",
      subtitle: "Recharge",
      icon: "mobile",
      style: "mobile",
      service: "Mobile Recharge",
    },
    {
      name: "Electricity",
      subtitle: "Electricity Bill",
      icon: "electricity",
      style: "electricity",
      service: "Electricity",
    },
    {
      name: "Credit Card",
      subtitle: "Bill Pay",
      icon: "bank",
      style: "credit",
      service: "Credit Card Bill",
    },
    {
      name: "DTH & Cable",
      subtitle: "Entertainment",
      icon: "television",
      style: "dth",
      service: "DTH Recharge",
    },
  ];

  // =====================================
  // PAYWAVE FEATURES
  // =====================================

  const features = [
    {
      title: "Split Expenses",
      description: "Divide bills with your friends",
      icon: "split",
      action: onOpenSplitExpenses,
    },
    {
      title: "Request Money",
      description: "Request payments from people",
      icon: "request",
      action: onOpenRequestMoney,
    },
    {
      title: "Payment Reminders",
      description: "Keep track of upcoming payments",
      icon: "reminder",
      action: onOpenPaymentReminders,
    },
  ];

  // =====================================
  // HOME NAVIGATION
  // =====================================

  const goToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="home-page">

      {/* =================================
                HEADER
            ================================= */}

      <header className="home-header">

        <div className="home-brand">

          <div className="home-logo">
            {/* <PayWaveIcon
                            name="wallet"
                            size={23}
                            color="#ffffff"
                        /> */}
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M17 29C21 23 26 23 31 29L34 32"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M47 35C43 41 38 41 33 35L30 32"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="47" cy="17" r="5" fill="#E86A24" />
            </svg>


          </div>

          <div className="home-brand-text">
            <h1>PayWave</h1>
            <span>Dashboard</span>
          </div>

        </div>

        <div className="home-header-actions">

          

          <button
            type="button"
            className="profile-button"
            onClick={onOpenProfile}
            aria-label="My Profile"
          >
            {firstName.charAt(0).toUpperCase()}
          </button>

        </div>

      </header>

      {/* =================================
                GREETING
            ================================= */}

      <section className="home-greeting">

        <div>
          <h2>
            {getGreeting()}, {firstName}
            <span className="greeting-spark"> ✦</span>
          </h2>

          <p>
            {user?.paywaveId
              ? `UPI ID: ${user.paywaveId}`
              : user?.mobileNumber
                ? `Mobile: +91 ${user.mobileNumber}`
                : "Welcome to PayWave"}
          </p>
        </div>



      </section>

      {/* =================================
                ANIMATED PAYWAVE HERO
            ================================= */}

      <section className="home-animation-card">

        <div className="animation-glow animation-glow-one" />
        <div className="animation-glow animation-glow-two" />

        <div className="animation-card-content">

          

          <h2>
            Payments made
            <span> simple.</span>
          </h2>

          <p>
            Fast, seamless and secure digital payments.
          </p>

        </div>

        <div className="payment-animation">

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="orbit-center">
            <PayWaveIcon
              name="wallet"
              size={37}
              color="#ffffff"
            />
          </div>

          <div className="floating-payment payment-one">
            <PayWaveIcon
              name="mobile"
              size={21}
              color="#0B1F3A"
            />
          </div>

          <div className="floating-payment payment-two">
            <PayWaveIcon
              name="bank"
              size={21}
              color="#0B1F3A"
            />
          </div>

          <div className="floating-payment payment-three">
            <PayWaveIcon
              name="scan"
              size={21}
              color="#0B1F3A"
            />
          </div>

          <div className="floating-coin coin-one">₹</div>
          <div className="floating-coin coin-two">₹</div>

          <div className="payment-success">
            <span>✓</span>
            Payment Success
          </div>

        </div>

        

      </section>

      {/* =================================
                UPI MONEY TRANSFER
            ================================= */}

      <section className="home-transfer-section">

        <div className="home-section-heading">
          <h3>UPI Money Transfer</h3>
          <span>Instant & Free</span>
        </div>

        <div className="home-transfer-grid">

          {transferActions.map((item) => (
            <button
              type="button"
              className={`home-transfer-item ${item.style}`}
              key={item.name}
              onClick={item.action}
            >
              <div className="transfer-icon">
                <PayWaveIcon
                  name={item.icon}
                  size={25}
                  color="#0B1F3A"
                />
              </div>

              <strong>{item.name}</strong>
              <span>{item.subtitle}</span>

            </button>
          ))}

        </div>

      </section>

      {/* =================================
                RECHARGE AND BILLS
            ================================= */}

      <section className="home-bills-section">

        <div className="home-section-heading">

          <h3>Recharge & Pay Bills</h3>

          <button
            type="button"
            onClick={() => onOpenService("All Services")}
          >
            View All ›
          </button>

        </div>

        <div className="home-bills-grid">

          {billActions.map((item) => (
            <button
              type="button"
              className="home-bill-item"
              key={item.name}
              onClick={() => onOpenService(item.service)}
            >
              <div className={`bill-icon ${item.style}`}>
                <PayWaveIcon
                  name={item.icon}
                  size={23}
                  color="#0B1F3A"
                />
              </div>

              <strong>{item.name}</strong>
              <span>{item.subtitle}</span>

            </button>
          ))}

        </div>

      </section>

      {/* =================================
                RECENT TRANSACTIONS
            ================================= */}

      <section className="home-recent-section">

        <div className="home-section-heading">

          <h3>Recent Transactions</h3>

          <button
            type="button"
            onClick={onOpenHistory}
          >
            View All ›
          </button>

        </div>

        {transactionLoading ? (
          <div className="home-transactions-state">
            Loading transactions...
          </div>
        ) : transactionError ? (
          <div className="home-transactions-state">
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
            No transactions yet. Your activity will appear here.
          </div>
        ) : (
          <div className="home-transactions-card">

            {recentTransactions.map((transaction, index) => {
              const details =
                getTransactionDetails(transaction);

              const successful =
                String(transaction.status || "")
                  .toUpperCase() === "SUCCESS";

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
                    className={`home-transaction-icon ${details.isCredit
                        ? "credit"
                        : "debit"
                      }`}
                  >
                    <PayWaveIcon
                      name={
                        details.isCredit
                          ? "receive"
                          : "send"
                      }
                      size={19}
                      color={
                        details.isCredit
                          ? "#16865C"
                          : "#D66E25"
                      }
                    />
                  </div>

                  <div className="home-transaction-info">

                    <strong>{details.name}</strong>

                    <span>
                      {formatDate(transaction.createdAt)}
                      {" · "}
                      {successful
                        ? "Successful"
                        : transaction.status ||
                        "Status unavailable"}
                    </span>

                  </div>

                  <strong
                    className={`home-transaction-amount ${details.isCredit
                        ? "credit"
                        : "debit"
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

      {/* =================================
                MORE PAYWAVE FEATURES
            ================================= */}

      <section className="home-features-section">

        <div className="home-section-heading">
          <h3>More from PayWave</h3>
          <span>EXPLORE</span>
        </div>

        <div className="home-features-card">

          {features.map((feature) => (
            <button
              type="button"
              className="home-feature-item"
              key={feature.title}
              onClick={feature.action}
            >
              <div className="home-feature-icon">
                <PayWaveIcon
                  name={feature.icon}
                  size={23}
                  color="#0B1F3A"
                />
              </div>

              <div>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </div>

              <span className="feature-arrow">›</span>

            </button>
          ))}

        </div>

      </section>

      {/* =================================
                SECURITY BANNER
            ================================= */}

      <section className="home-security-banner">

        <div>
          <span>PAYWAVE SECURITY</span>

          <h3>Your money. Your control.</h3>

          <p>
            Never share your payment PIN or OTP with anyone.
          </p>
        </div>

        <PayWaveIcon
          name="security"
          size={37}
          color="#FFAD55"
        />

      </section>

      {/* =================================
                BOTTOM NAVIGATION
            ================================= */}

      <nav className="home-bottom-navigation">

        <button
          type="button"
          className="home-nav-item active"
          onClick={goToHome}
        >
          <PayWaveIcon name="home" size={22} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className="home-nav-item"
          onClick={onOpenHistory}
        >
          <PayWaveIcon name="history" size={22} />
          <span>History</span>
        </button>

        <button
          type="button"
          className="home-nav-item home-nav-scan"
          onClick={onOpenScanQR}
        >
          <PayWaveIcon
            name="scan"
            size={25}
            color="#ffffff"
          />
          <span>Scan</span>
        </button>

        <button
          type="button"
          className="home-nav-item"
          onClick={onOpenWallet}
        >
          <PayWaveIcon name="wallet" size={22} />
          <span>Wallet</span>
        </button>

        <button
          type="button"
          className="home-nav-item"
          onClick={onOpenProfile}
        >
          <PayWaveIcon name="profile" size={22} />
          <span>Profile</span>
        </button>

      </nav>

    </main>
  );
}

export default Home;
