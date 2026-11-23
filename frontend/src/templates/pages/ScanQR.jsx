import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import PayWaveIcon from "../../templates/components/PayWaveIcon";
import {
    getPayWaveRecipient,
    sendMoney,
} from "../services/paywaveApi";

import "../../static/css/ScanQR.css";

function ScanQR({ onBack }) {
    const scannerRef = useRef(null);
    const startingRef = useRef(false);
    const processingRef = useRef(false);
    const mountedRef = useRef(true);

    const [cameraActive, setCameraActive] = useState(false);
    const [manualId, setManualId] = useState("");

    const [step, setStep] = useState("scan");
    const [recipient, setRecipient] = useState(null);

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [mpin, setMpin] = useState("");

    const [loadingRecipient, setLoadingRecipient] = useState(false);
    const [paying, setPaying] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const getErrorMessage = (err) =>
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string"
            ? err.response.data
            : null) ||
        err?.message ||
        "Something went wrong. Please try again.";

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(Number(value || 0));

    // Stop camera safely
    const stopCamera = async () => {
        const scanner = scannerRef.current;

        if (!scanner) {
            if (mountedRef.current) setCameraActive(false);
            return;
        }

        try {
            if (scanner.isScanning) {
                await scanner.stop();
            }

            scanner.clear();
        } catch (err) {
            console.error("Camera stop error:", err);
        } finally {
            scannerRef.current = null;

            if (mountedRef.current) {
                setCameraActive(false);
            }

            startingRef.current = false;
        }
    };

    // Extract PayWave ID from QR payload
    const extractPaywaveId = (value) => {
        const input = value.trim();

        try {
            const url = new URL(input);

            if (
                url.protocol !== "paywave:" ||
                url.hostname !== "pay"
            ) {
                return null;
            }

            return url.searchParams.get("paywaveId")?.trim() || null;
        } catch {
            if (/^[a-zA-Z0-9._-]+@paywave$/i.test(input)) {
                return input;
            }

            return null;
        }
    };

    // Verify recipient with backend
    const lookupRecipient = async (rawValue) => {
        if (processingRef.current) return;

        processingRef.current = true;
        setError("");
        setRecipient(null);

        const paywaveId = extractPaywaveId(rawValue);

        if (!paywaveId) {
            setError("Invalid QR code. Please scan a valid PayWave QR.");
            processingRef.current = false;
            return;
        }

        setLoadingRecipient(true);

        try {
            const response = await getPayWaveRecipient(paywaveId);

            if (!mountedRef.current) return;

            const data = response.data;

            if (!data?.paywaveId || !data?.name) {
                throw new Error("Invalid recipient information received.");
            }

            setRecipient({
                name: data.name,
                paywaveId: data.paywaveId,
            });

            setStep("amount");
        } catch (err) {
            if (mountedRef.current) {
                setError(getErrorMessage(err));
            }
        } finally {
            if (mountedRef.current) {
                setLoadingRecipient(false);
            }

            processingRef.current = false;
        }
    };

    // Start camera
    const startCamera = async () => {
        if (startingRef.current || cameraActive) return;

        startingRef.current = true;
        setError("");

        if (!window.isSecureContext) {
            setError("Camera requires HTTPS or localhost.");
            startingRef.current = false;
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            setError("Camera access is unavailable in this browser.");
            startingRef.current = false;
            return;
        }

        try {
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1,
                },
                async (decodedText) => {
                    if (processingRef.current) return;

                    processingRef.current = true;

                    await stopCamera();

                    if (mountedRef.current) {
                        await lookupRecipient(decodedText);
                    }
                },
                () => {
                    // Ignore unsuccessful frames
                }
            );

            if (mountedRef.current) {
                setCameraActive(true);
            }
        } catch (err) {
            console.error("QR scanner error:", err);

            const message = String(err?.message || err).toLowerCase();

            if (
                err?.name === "NotAllowedError" ||
                message.includes("permission")
            ) {
                setError("Camera permission denied. Allow camera access.");
            } else if (
                err?.name === "NotFoundError" ||
                message.includes("no camera")
            ) {
                setError("No camera found on this device.");
            } else {
                setError("Unable to start camera. Please try again.");
            }

            await stopCamera();
        } finally {
            startingRef.current = false;
        }
    };

    // Manual PayWave ID
    const handleManualSubmit = async (event) => {
        event.preventDefault();

        if (!manualId.trim()) {
            setError("Enter a PayWave ID.");
            return;
        }

        await stopCamera();
        await lookupRecipient(manualId);
        setManualId("");
    };

    // Amount validation
    const handleContinueAmount = () => {
        const numericAmount = Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0 ||
            !/^\d+(\.\d{1,2})?$/.test(amount)
        ) {
            setError("Enter a valid amount with up to 2 decimal places.");
            return;
        }

        if (numericAmount > 100000) {
            setError("Maximum payment amount is ₹1,00,000.");
            return;
        }

        setError("");
        setStep("review");
    };

    // Review before MPIN
    const handleContinueReview = () => {
        setError("");
        setMpin("");
        setStep("pin");
    };

    // Actual backend payment
    const handlePayment = async () => {
        if (!/^\d{6}$/.test(mpin)) {
            setError("Enter your 6-digit MPIN.");
            return;
        }

        if (!recipient?.paywaveId) {
            setError("Recipient information is missing.");
            return;
        }

        setPaying(true);
        setError("");

        try {
            const payload = {
                receiverPaywaveId: recipient.paywaveId,
                amount: Number(amount),
                description: description.trim(),
                mpin,
            };

            const response = await sendMoney(payload);

            setSuccessMessage(
                typeof response.data === "string"
                    ? response.data
                    : "Money sent successfully!"
            );

            setMpin("");
            setStep("success");
        } catch (err) {
            setError(getErrorMessage(err));
            setMpin("");
        } finally {
            setPaying(false);
        }
    };

    // Reset complete flow
    const handleReset = () => {
        setRecipient(null);
        setAmount("");
        setDescription("");
        setMpin("");
        setManualId("");
        setError("");
        setSuccessMessage("");
        processingRef.current = false;
        setStep("scan");
    };

    const goBack = async () => {
        setError("");

        if (step === "scan") {
            await stopCamera();
            onBack();
        } else if (step === "amount") {
            setStep("scan");
            setRecipient(null);
        } else if (step === "review") {
            setStep("amount");
        } else if (step === "pin") {
            setStep("review");
        } else {
            onBack();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            const scanner = scannerRef.current;

            if (scanner) {
                if (scanner.isScanning) {
                    scanner.stop()
                        .then(() => scanner.clear())
                        .catch((err) =>
                            console.error("Camera cleanup error:", err)
                        );
                } else {
                    try {
                        scanner.clear();
                    } catch (err) {
                        console.error(err);
                    }
                }

                scannerRef.current = null;
            }
        };
    }, []);

    // Automatically start camera when scan screen opens
    useEffect(() => {
        if (step !== "scan") return;

        const timer = window.setTimeout(() => {
            if (mountedRef.current) {
                startCamera();
            }
        }, 150);

        return () => window.clearTimeout(timer);
    }, [step]);

    return (
        <main className="scan-page">

            {/* Header */}
            <header className="scan-header">
                <button
                    type="button"
                    className="scan-back-button"
                    onClick={goBack}
                    aria-label="Go back"
                >
                    ←
                </button>

                <div>
                    <h2>Scan & Pay</h2>
                    <p>Pay securely with PayWave</p>
                </div>
            </header>

            {/* SCAN STEP */}
            {step === "scan" && (
                <>
                    <section className="scan-intro">
                        <span className="scan-eyebrow">
                            PAYWAVE QR PAYMENT
                        </span>

                        <h1>Scan. Verify. Pay.</h1>

                        <p>
                            Scan another user's personal PayWave QR code
                            to send money.
                        </p>
                    </section>

                    <section className="scan-camera-card">

                        <div
                            className={`scan-camera-view ${
                                cameraActive ? "active" : ""
                            }`}
                        >
                            <div id="qr-reader" className="scan-video" />

                            {!cameraActive && (
                                <div className="scan-camera-placeholder">
                                    <div className="scan-placeholder-icon">
                                        <PayWaveIcon name="scan" size={42} />
                                    </div>

                                    <h3>
                                        {error
                                            ? "Camera unavailable"
                                            : "Opening camera..."}
                                    </h3>

                                    <p>
                                        {error
                                            ? "Allow camera access and try again."
                                            : "Please wait while we connect to your camera."}
                                    </p>
                                </div>
                            )}

                            {cameraActive && (
                                <div className="scan-frame">
                                    <span className="scan-corner top-left" />
                                    <span className="scan-corner top-right" />
                                    <span className="scan-corner bottom-left" />
                                    <span className="scan-corner bottom-right" />
                                    <span className="scan-line" />
                                </div>
                            )}
                        </div>

                        <div className="scan-camera-status">
                            <span
                                className={`scan-status-dot ${
                                    cameraActive ? "online" : ""
                                }`}
                            />

                            <p>
                                {cameraActive
                                    ? "Camera active · Scan a PayWave QR"
                                    : loadingRecipient
                                        ? "Verifying PayWave user..."
                                        : "Connecting to camera..."}
                            </p>
                        </div>

                        {error && (
                            <button
                                type="button"
                                className="scan-camera-button"
                                onClick={startCamera}
                            >
                                Try Camera Again
                            </button>
                        )}
                    </section>

                    {error && <p className="scan-error">{error}</p>}

                    <section className="scan-manual-section">
                        <div className="scan-or-divider">
                            <span />
                            <p>OR ENTER PAYWAVE ID</p>
                            <span />
                        </div>

                        <form onSubmit={handleManualSubmit}>
                            <label htmlFor="manual-paywave-id">
                                Recipient PayWave ID
                            </label>

                            <input
                                id="manual-paywave-id"
                                type="text"
                                value={manualId}
                                onChange={(event) =>
                                    setManualId(event.target.value)
                                }
                                placeholder="example1234@paywave"
                            />

                            <button
                                type="submit"
                                disabled={loadingRecipient}
                            >
                                {loadingRecipient
                                    ? "Verifying..."
                                    : "Find Recipient"}
                            </button>
                        </form>
                    </section>
                </>
            )}

            {/* RECIPIENT VERIFIED */}
            {step === "amount" && recipient && (
                <section className="scan-result-card">

                    <div className="scan-success-icon">✓</div>

                    <span className="scan-eyebrow">
                        RECIPIENT VERIFIED
                    </span>

                    <h1>Send Money</h1>

                    <p className="scan-result-subtitle">
                        Confirm the recipient before entering the amount.
                    </p>

                    <div className="scan-verified-recipient">
                        <div className="scan-recipient-avatar">
                            {recipient.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="scan-recipient-info">
                            <h3>{recipient.name}</h3>
                            <p>{recipient.paywaveId}</p>

                            <span className="scan-verified-badge">
                                <span>✓</span> PayWave Verified
                            </span>
                        </div>

                        <div className="scan-verified-check">✓</div>
                    </div>

                    <div className="scan-payment-input">
                        <label htmlFor="scan-amount">AMOUNT (₹)</label>

                        <input
                            id="scan-amount"
                            type="number"
                            min="0.01"
                            max="100000"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(event) => {
                                setAmount(event.target.value);
                                setError("");
                            }}
                        />

                        <label htmlFor="scan-description">
                            DESCRIPTION (OPTIONAL)
                        </label>

                        <input
                            id="scan-description"
                            type="text"
                            maxLength={255}
                            placeholder="What's this payment for?"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>

                    {error && <p className="scan-error">{error}</p>}

                    <button
                        type="button"
                        className="scan-camera-button"
                        onClick={handleContinueAmount}
                    >
                        Continue to Review
                    </button>
                </section>
            )}

            {/* REVIEW */}
            {step === "review" && recipient && (
                <section className="scan-result-card">

                    <span className="scan-eyebrow">PAYMENT REVIEW</span>

                    <h1>Confirm Details</h1>

                    <div className="scan-result-details">
                        <div>
                            <span>Paying to</span>
                            <strong>{recipient.name}</strong>
                        </div>

                        <div>
                            <span>PayWave ID</span>
                            <strong>{recipient.paywaveId}</strong>
                        </div>

                        <div>
                            <span>Amount</span>
                            <strong>{formatCurrency(amount)}</strong>
                        </div>

                        <div>
                            <span>Description</span>
                            <strong>{description || "No description"}</strong>
                        </div>

                        <div>
                            <span>Payment Mode</span>
                            <strong>PayWave Wallet</strong>
                        </div>
                    </div>

                    <p className="scan-demo-notice">
                        This is a simulated wallet payment. Verify the
                        recipient and amount before proceeding.
                    </p>

                    {error && <p className="scan-error">{error}</p>}

                    <button
                        type="button"
                        className="scan-camera-button"
                        onClick={handleContinueReview}
                    >
                        Proceed to MPIN
                    </button>
                </section>
            )}

            {/* MPIN */}
            {step === "pin" && recipient && (
                <section className="scan-result-card">

                    <div className="scan-success-icon">
                        <PayWaveIcon name="security" size={30} />
                    </div>

                    <span className="scan-eyebrow">
                        PAYMENT AUTHORIZATION
                    </span>

                    <h1>Enter your MPIN</h1>

                    <p className="scan-result-subtitle">
                        Sending {formatCurrency(amount)} to {recipient.name}
                    </p>

                    <div className="scan-payment-input">
                        <label htmlFor="scan-mpin">6-DIGIT MPIN</label>

                        <input
                            id="scan-mpin"
                            type="password"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength={6}
                            placeholder="••••"
                            value={mpin}
                            onChange={(event) => {
                                setMpin(
                                    event.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                );
                                setError("");
                            }}
                        />
                    </div>

                    {error && <p className="scan-error">{error}</p>}

                    <button
                        type="button"
                        className="scan-camera-button"
                        disabled={paying}
                        onClick={handlePayment}
                    >
                        {paying
                            ? "Processing Payment..."
                            : "Confirm & Pay"}
                    </button>
                </section>
            )}

            {/* SUCCESS */}
            {step === "success" && recipient && (
                <section className="scan-result-card">

                    <div className="scan-success-icon">✓</div>

                    <span className="scan-eyebrow">
                        TRANSACTION SUCCESSFUL
                    </span>

                    <h1>Payment Successful!</h1>

                    <p className="scan-result-subtitle">
                        {successMessage}
                    </p>

                    <div className="scan-result-details">
                        <div>
                            <span>Amount Sent</span>
                            <strong>{formatCurrency(amount)}</strong>
                        </div>

                        <div>
                            <span>Recipient</span>
                            <strong>{recipient.name}</strong>
                        </div>

                        <div>
                            <span>PayWave ID</span>
                            <strong>{recipient.paywaveId}</strong>
                        </div>

                        <div>
                            <span>Description</span>
                            <strong>{description || "No description"}</strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>SUCCESS</strong>
                        </div>
                    </div>

                    <p className="scan-demo-notice">
                        Your simulated PayWave wallet transaction has been completed.
                    </p>

                    <button
                        type="button"
                        className="scan-camera-button"
                        onClick={handleReset}
                    >
                        Scan Another QR
                    </button>

                    <button
                        type="button"
                        className="scan-secondary-button"
                        onClick={onBack}
                    >
                        Back to Home
                    </button>
                </section>
            )}

            {loadingRecipient && (
                <p className="scan-loading">
                    Verifying PayWave user...
                </p>
            )}

            <p className="scan-disclaimer">
                PayWave is an educational payment simulation.
                No real bank or UPI transfer takes place.
            </p>

        </main>
    );
}

export default ScanQR;