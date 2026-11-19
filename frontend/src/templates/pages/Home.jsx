
import { useState } from "react";
import "../../static/css/Home.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

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

  const contacts = [
    { name: "Aman Khan", number: "9123456780", initial: "A" },
    { name: "Rahul Sharma", number: "9876543210", initial: "R" },
    { name: "Sara Khan", number: "9988776655", initial: "S" },
    { name: "Arjun Mehta", number: "9876501234", initial: "A" },
    { name: "Zoya Shaikh", number: "8765432109", initial: "Z" },
    { name: "Kabir Patel", number: "9090909090", initial: "K" },
    { name: "Neha Verma", number: "9898989898", initial: "N" },
    { name: "Aditya Rao", number: "9123098765", initial: "A" },
    { name: "Ishita Khan", number: "9988771122", initial: "I" },
    { name: "Rohan Das", number: "9000012345", initial: "R" },
  ];

  const [mobileNumber, setMobileNumber] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.number.includes(mobileNumber)
  );

  const quickActions = [
    { name: "Send Money", icon: "send", style: "send" },
    { name: "Receive", icon: "receive", style: "receive" },
    { name: "Scan QR", icon: "scan", style: "scan" },
    { name: "Bank Account", icon: "bank", style: "bank" },
  ];

  const everydayPayments = [
    { icon: "mobile", name: "Mobile Recharge", color: "orange" },
    { icon: "electricity", name: "Electricity", color: "yellow" },
    { icon: "television", name: "DTH Recharge", color: "purple" },
    { icon: "water", name: "Water Bill", color: "blue" },
  ];

  const handleAction = (action) => {
    switch (action) {
      case "Bank Account":
        onOpenBankAccounts();
        break;
      case "Send Money":
        onOpenSendMoney();
        break;
      case "Receive":
        onOpenReceiveMoney();
        break;
      case "Scan QR":
        onOpenScanQR();
        break;
      default:
        break;
    }
  };

  return (
    <main className="home-page">

      {/* Header */}
      <header className="home-header">
        <div>
          <h1>PayWave<span>.</span></h1>
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

      {/* Search by Phone Number */}
      <section className="home-search-section">
        <div className="home-search-heading">
          <div>
            <span className="home-eyebrow">QUICK TRANSFER</span>
            <h3>Find someone</h3>
          </div>

          <PayWaveIcon name="upi" size={27} color="#F28C28" />
        </div>

        <div className="mobile-search-box">
          <PayWaveIcon name="profile" size={23} color="#77838D" />

          <input
            type="tel"
            placeholder="Search by phone number"
            value={mobileNumber}
            onChange={(event) =>
              setMobileNumber(
                event.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            maxLength={10}
            inputMode="numeric"
          />

          {mobileNumber && (
            <button
              type="button"
              onClick={() => setMobileNumber("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {mobileNumber && (
          <div className="search-results">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div className="search-contact" key={contact.number}>
                  <div className="contact-avatar">{contact.initial}</div>
                  <div>
                    <strong>{contact.name}</strong>
                    <span>{contact.number}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-search-result">
                No matching saved contact found.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Quick Actions */}
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
              onClick={() => handleAction(action.name)}
            >
              <span className={`action-icon ${action.style}`}>
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

      {/* Everyday Payments */}
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

      {/* PayWave Features */}
      <section className="features-section">
        <div className="section-heading">
          <h3>PayWave Features</h3>
          <span>EXPLORE</span>
        </div>

        <div className="features-card">

          <button
            className="feature-item"
            type="button"
            onClick={onOpenSplitExpenses}
            style={{
              width: "100%",
              border: 0,
              background: "transparent",
              textAlign: "left",
              font: "inherit",
            }}
          >
            <div className="feature-icon expense-icon">
              <PayWaveIcon name="split" size={29} color="#172B3A" />
            </div>

            <div className="feature-info">
              <h4>Split Expenses</h4>
              <p>Divide bills with your friends</p>
            </div>

            <span className="feature-arrow">›</span>
          </button>

          <button
            className="feature-item"
            type="button"
            onClick={onOpenRequestMoney}
            style={{
              width: "100%",
              border: 0,
              background: "transparent",
              textAlign: "left",
              font: "inherit",
            }}
          >
            <div className="feature-icon request-icon">
              <PayWaveIcon name="request" size={29} color="#172B3A" />
            </div>

            <div className="feature-info">
              <h4>Request Money</h4>
              <p>Request payments from people</p>
            </div>

            <span className="feature-arrow">›</span>
          </button>

          <button
            className="feature-item"
            type="button"
            onClick={onOpenPaymentReminders}
            style={{
              width: "100%",
              border: 0,
              background: "transparent",
              textAlign: "left",
              font: "inherit",
            }}
          >
            <div className="feature-icon schedule-icon">
              <PayWaveIcon name="reminder" size={29} color="#172B3A" />
            </div>

            <div className="feature-info">
              <h4>Payment Reminders</h4>
              <p>Keep track of upcoming payments</p>
            </div>

            <span className="feature-arrow">›</span>
          </button>

        </div>
      </section>

      {/* PayWave Spotlight */}
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
            <PayWaveIcon name="security" size={43} color="#FFAD55" />
          </div>
        </div>
      </section>

      {/* Your Contacts */}
      <section className="people-section">
        <div className="section-heading">
          <h3>Your Contacts</h3>
        </div>

        <div className="people-grid">
          {contacts.map((contact, index) => (
            <button
              type="button"
              className="people-item"
              key={contact.number}
              onClick={() => setMobileNumber(contact.number)}
            >
              <div className={`people-avatar people-avatar-${index}`}>
                {contact.initial}
              </div>
              <span>{contact.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="demo-disclaimer">
        PayWave is an educational payment simulation.
        No real money is transferred.
      </p>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item active" type="button">
          <PayWaveIcon name="home" size={24} />
          <span>Home</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={onOpenHistory}
        >
          <PayWaveIcon name="history" size={24} />
          <span>History</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={onOpenWallet}
        >
          <PayWaveIcon name="wallet" size={24} />
          <span>Wallet</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={onOpenProfile}
        >
          <PayWaveIcon name="profile" size={24} />
          <span>Profile</span>
        </button>
      </nav>

    </main>
  );
}

export default Home;
