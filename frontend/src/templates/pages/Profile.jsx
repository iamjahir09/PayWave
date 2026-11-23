
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

import PayWaveIcon from "../../templates/components/PayWaveIcon";
import { getMyQr } from "../services/paywaveApi";

import "../../static/css/Profile.css";

function Profile({ user, onBack, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [walletRevealed, setWalletRevealed] = useState(false);

  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState("");

  const walletRef = useRef(null);

  const displayName = qrData?.name || user?.name || "PayWave User";
  const mobileNumber = user?.mobileNumber || "Not added";
  const email = user?.email || "Not added";

  const paywaveId = qrData?.paywaveId || "";
  const qrPayload = qrData?.qrPayload || "";

  // Fetch logged-in user's unique QR
  useEffect(() => {
    let mounted = true;

    const loadQr = async () => {
      setQrLoading(true);
      setQrError("");

      try {
        const response = await getMyQr();

        if (mounted) {
          setQrData(response.data);
        }
      } catch (err) {
        if (mounted) {
          setQrError(
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Unable to load your QR code."
          );
        }
      } finally {
        if (mounted) {
          setQrLoading(false);
        }
      }
    };

    loadQr();

    return () => {
      mounted = false;
    };
  }, []);

  // Wallet reveal animation
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

  // Copy actual PayWave ID
  const handleCopyId = async () => {
    if (!paywaveId) return;

    try {
      await navigator.clipboard.writeText(paywaveId);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      alert("Unable to copy PayWave ID.");
    }
  };

  return (
      <div className="profile-page">

        {/* Header */}
        <header className="profile-header">
          <button
              className="profile-back-button"
              onClick={onBack}
          >
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
          <button
              className="profile-logout-button"
              onClick={onLogout}
          >
            <PayWaveIcon name="profile" size={20} />
            <span>Logout</span>
          </button>

          {/* QR Wallet */}
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

                {/* Actual Scannable QR */}
                <div className="profile-qr-visual">

                  {qrLoading ? (
                      <p>Loading QR...</p>
                  ) : qrError ? (
                      <p>{qrError}</p>
                  ) : qrPayload ? (
                      <QRCodeSVG
                          value={qrPayload}
                          size={190}
                          level="H"
                          includeMargin={true}
                          bgColor="#FFFFFF"
                          fgColor="#172b3a"
                      />
                  ) : (
                      <p>QR unavailable</p>
                  )}

                </div>

                <h3>{displayName}</h3>

                <p className="profile-demo-id">
                  {paywaveId || "PayWave ID unavailable"}
                </p>

                <span className="profile-qr-demo-label">
                PERSONAL QR CODE
              </span>

                <button
                    type="button"
                    className="profile-copy-button"
                    onClick={handleCopyId}
                    disabled={!paywaveId}
                >
                  {copied ? "Copied!" : "Copy PayWave ID"}
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
          </section>

        </main>
      </div>
  );
}

export default Profile;
