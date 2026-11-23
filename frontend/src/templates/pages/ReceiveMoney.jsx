
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import {
    getMyQr,
} from "../services/paywaveApi";

import "../../static/css/ReceiveMoney.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

function BackIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="13" height="13" rx="2" />
            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
    );
}

function ShareIcon() {
    return (
        <svg width="21" height="21" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.7 10.7 6.6-4.4" />
            <path d="m8.7 13.3 6.6 4.4" />
        </svg>
    );
}

function ReceiveMoney({ user, onBack }) {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const displayName = qrData?.name || user?.name || "PayWave User";
    const payWaveId = qrData?.paywaveId || "";
    const qrPayload = qrData?.qrPayload || "";
    const mobileNumber = user?.mobileNumber || "Not available";

    useEffect(() => {
        let mounted = true;

        const loadQr = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getMyQr();

                if (mounted) {
                    setQrData(response.data);
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "Unable to load your QR code. Please try again."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadQr();

        return () => {
            mounted = false;
        };
    }, []);

    const handleCopy = async () => {
        if (!payWaveId) return;

        try {
            await navigator.clipboard.writeText(payWaveId);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            alert("Unable to copy. Please copy your PayWave ID manually.");
        }
    };

    const handleShare = async () => {
        const shareText =
            `Pay me using PayWave!\n` +
            `Name: ${displayName}\n` +
            `PayWave ID: ${payWaveId}\n` +
            `Mobile: ${mobileNumber}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My PayWave Details",
                    text: shareText,
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Sharing failed:", err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert("Payment details copied!");
            } catch {
                alert(shareText);
            }
        }
    };

    return (
        <main className="receive-page">

            {/* Header */}
            <header className="receive-header">
                <button
                    className="receive-back-button"
                    type="button"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    <BackIcon />
                </button>

                <div>
                    <h2>Receive Money</h2>
                    <p>Accept payments with PayWave</p>
                </div>
            </header>

            {/* Intro */}
            <section className="receive-intro">
                <div className="receive-intro-icon">
                    <PayWaveIcon name="receive" size={32} color="#FFAD55" />
                </div>

                <h1>Get paid, effortlessly.</h1>

                <p>
                    Let your friends scan your QR code or use your
                    PayWave ID to send you money.
                </p>
            </section>

            {/* QR Card */}
            <section className="receive-qr-card">

                <div className="receive-user-info">
                    <div className="receive-avatar">
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3>{displayName}</h3>
                        <p>PayWave User</p>
                    </div>

                    <span className="receive-verified">
            <PayWaveIcon name="security" size={15} />
          </span>
                </div>

                <div className="receive-qr-container">
                    {loading ? (
                        <p>Generating your QR code...</p>
                    ) : error ? (
                        <p className="receive-error">{error}</p>
                    ) : qrPayload ? (
                        <QRCodeSVG
                            value={qrPayload}
                            size={220}
                            level="H"
                            includeMargin={true}
                            bgColor="#FFFFFF"
                            fgColor="#111111"
                        />
                    ) : (
                        <p className="receive-error">
                            QR code data is unavailable.
                        </p>
                    )}
                </div>

                <p className="receive-qr-caption">
                    Your personal PayWave QR
                </p>

                <div className="receive-divider">
                    <span />
                    <p>YOUR PAYWAVE ID</p>
                    <span />
                </div>

                <div className="receive-id-box">
                    <div>
                        <small>PayWave ID</small>
                        <strong>{payWaveId || "Unavailable"}</strong>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!payWaveId}
                        aria-label="Copy PayWave ID"
                    >
                        <CopyIcon />
                    </button>
                </div>

                {copied && (
                    <p className="receive-copy-success">
                        PayWave ID copied successfully!
                    </p>
                )}

            </section>

            {/* Share Details */}
            <section className="receive-share-section">
                <button
                    className="receive-share-button"
                    type="button"
                    onClick={handleShare}
                    disabled={!payWaveId}
                >
                    <ShareIcon />
                    Share Payment Details
                </button>

                <p>
                    Share your details with anyone who wants to pay you.
                </p>
            </section>

            {/* Account Details */}
            <section className="receive-details-card">
                <h3>Account Details</h3>

                <div className="receive-detail-row">
                    <span>Account Holder</span>
                    <strong>{displayName}</strong>
                </div>

                <div className="receive-detail-row">
                    <span>Mobile Number</span>
                    <strong>{mobileNumber}</strong>
                </div>

                <div className="receive-detail-row">
                    <span>PayWave ID</span>
                    <strong>{payWaveId || "Unavailable"}</strong>
                </div>
            </section>

            {/* Security Notice */}
            <section className="receive-security-card">
                <PayWaveIcon name="security" size={25} color="#16865C" />

                <div>
                    <h4>Stay Safe</h4>
                    <p>
                        You never need to enter your UPI PIN to receive
                        money. Never share your PIN or OTP with anyone.
                    </p>
                </div>
            </section>

            <p className="receive-disclaimer">
                PayWave is an educational payment simulation.
                No real money is received or transferred.
            </p>

        </main>
    );
}

export default ReceiveMoney;
