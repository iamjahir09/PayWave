
import { useState, useEffect, useRef } from "react";
import PayWaveIcon from "../../templates/components/PayWaveIcon";
import "../../static/css/Profile.css";

function Profile({ user, onBack, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [walletRevealed, setWalletRevealed] = useState(false);

  const walletRef = useRef(null);

  const demoId = "jahir@paywave";

  const isFinderCell = (row, col, startRow, startCol) => {
    const r = row - startRow;
    const c = col - startCol;

    if (r < 0 || r > 6 || c < 0 || c > 6) return false;

    return (
      r === 0 ||
      r === 6 ||
      c === 0 ||
      c === 6 ||
      (r >= 2 && r <= 4 && c >= 2 && c <= 4)
    );
  };

  const isDarkCell = (row, col) => {
    if (
      isFinderCell(row, col, 0, 0) ||
      isFinderCell(row, col, 0, 14) ||
      isFinderCell(row, col, 14, 0)
    ) {
      return true;
    }

    // Decorative demo pattern only, not a real QR code.
    const value = (row * 17 + col * 11 + row * col * 3) % 7;
    return value === 0 || value === 2 || value === 4;
  };

  useEffect(() => {
  const walletElement = walletRef.current;

  if (!walletElement) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setWalletRevealed(entry.isIntersecting);
    },
    {
      threshold: 0.4,
    }
  );

  observer.observe(walletElement);

  return () => observer.disconnect();
}, []);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(demoId);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const displayName = user?.name || "PayWave User";
  const mobileNumber = user?.mobileNumber || "Not added";
  const email = user?.email || "Not added";

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <button className="profile-back-button" onClick={onBack}>
          ←
        </button>

        <div>
          <h1>My Profile</h1>
          <p>Manage your account</p>
        </div>

        <div className="profile-header-icon">
          <PayWaveIcon name="profile" />
        </div>
      </header>

      <main className="profile-content">
        {/* User Information Card */}
        <section className="profile-user-card">
          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-user-info">
            <h2>{displayName}</h2>
            <p>{mobileNumber}</p>
            <span>PayWave Member</span>
          </div>

          <div className="profile-member-check">✓</div>
        </section>

        {/* Personal Information */}
        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Personal Information</h2>
            <span>ACCOUNT</span>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-row">
              <div className="profile-info-icon">
                <PayWaveIcon name="profile" />
              </div>

              <div>
                <small>Full Name</small>
                <strong>{displayName}</strong>
              </div>
            </div>

            <div className="profile-info-row">
              <div className="profile-info-icon">
                <PayWaveIcon name="mobile" />
              </div>

              <div>
                <small>Mobile Number</small>
                <strong>{mobileNumber}</strong>
              </div>
            </div>

            <div className="profile-info-row">
              <div className="profile-info-icon">
                <PayWaveIcon name="request" />
              </div>

              <div>
                <small>Email Address</small>
                <strong>{email}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Security & Privacy</h2>
            <span>PROTECTION</span>
          </div>

          <div className="profile-menu-card">
            <div className="profile-menu-item">
              <div className="profile-menu-icon security">
                <PayWaveIcon name="security" />
              </div>

              <div className="profile-menu-text">
                <strong>App Security</strong>
                <small>Keep your account protected</small>
              </div>

              <span className="profile-menu-arrow">›</span>
            </div>

            <div className="profile-menu-item">
              <div className="profile-menu-icon pin">
                <PayWaveIcon name="upi" />
              </div>

              <div className="profile-menu-text">
                <strong>Change MPIN</strong>
                <small>Manage your login PIN</small>
              </div>

              <span className="profile-menu-arrow">›</span>
            </div>
          </div>
        </section>

        {/* App Preferences */}
        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>App Preferences</h2>
            <span>SETTINGS</span>
          </div>

          <div className="profile-menu-card">
            <div className="profile-menu-item">
              <div className="profile-menu-icon notifications">
                <PayWaveIcon name="reminder" />
              </div>

              <div className="profile-menu-text">
                <strong>Notifications</strong>
                <small>Payment and account updates</small>
              </div>

              <span className="profile-menu-arrow">›</span>
            </div>

            <div className="profile-menu-item">
              <div className="profile-menu-icon help">
                <PayWaveIcon name="request" />
              </div>

              <div className="profile-menu-text">
                <strong>Help & Support</strong>
                <small>Get help with PayWave</small>
              </div>

              <span className="profile-menu-arrow">›</span>
            </div>
          </div>
        </section>

        {/* Logout */}
        <button className="profile-logout-button" onClick={onLogout}>
          <PayWaveIcon name="profile" size={20} />
          <span>Logout</span>
        </button>

        <p className="profile-version">
          PAYWAVE · DEMO VERSION 1.0
        </p>

        {/* QR Wallet - At the Bottom */}
        <section
          ref={walletRef}
          className={`profile-wallet-section ${
            walletRevealed ? "revealed" : ""
          }`}
        >
          <div className="profile-wallet-heading">
            <span className="profile-eyebrow">
              YOUR PAYWAVE IDENTITY
            </span>

            <h2>Your QR Wallet</h2>
            <p>Your identity, always within reach.</p>
          </div>

          <div className="profile-wallet-stage">
            {/* QR Card */}
            <div className="profile-wallet-qr-card">
              <div className="profile-qr-brand">
                <PayWaveIcon name="upi" size={23} />
                <strong>PayWave</strong>
              </div>

              <div className="profile-qr-visual">
                <svg
                  viewBox="0 0 21 21"
                  role="img"
                  aria-label="Decorative demo pattern, not scannable"
                >
                  <rect
                    width="21"
                    height="21"
                    fill="#ffffff"
                  />

                  {Array.from({ length: 21 }, (_, row) =>
                    Array.from({ length: 21 }, (_, col) =>
                      isDarkCell(row, col) ? (
                        <rect
                          key={`${row}-${col}`}
                          x={col}
                          y={row}
                          width="1"
                          height="1"
                          fill="#172b3a"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <h3>{displayName}</h3>

              <p className="profile-demo-id">
                {demoId}
              </p>

              <span className="profile-qr-demo-label">
                DEMO QR · NOT FOR REAL PAYMENTS
              </span>

              <button
                className="profile-copy-button"
                onClick={handleCopyId}
              >
                {copied ? "Copied!" : "Copy Demo ID"}
              </button>
            </div>

            {/* Wallet Design */}
            <div className="profile-wallet-body">
              <div className="profile-wallet-flap">
                <div className="profile-wallet-clasp" />
              </div>

              <div className="profile-wallet-front">
                <div className="profile-wallet-brand">
                  <PayWaveIcon name="wallet" size={24} />
                  <strong>PayWave</strong>
                </div>

                <span className="profile-wallet-decoration" />
              </div>
            </div>
          </div>

          <p className="profile-qr-note">
            This is a temporary visual preview and cannot be
            scanned for real payments. A unique, scannable QR
            will be generated after backend integration.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Profile;
