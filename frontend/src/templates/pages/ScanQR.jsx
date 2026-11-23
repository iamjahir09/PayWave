
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import "../../static/css/ScanQR.css";

function ScanQR({ onBack }) {
    const scannerRef = useRef(null);
    const startingRef = useRef(false);

    const [cameraActive, setCameraActive] = useState(false);
    const [manualId, setManualId] = useState("");
    const [detectedValue, setDetectedValue] = useState("");
    const [error, setError] = useState("");

    // Stop camera and release resources
    const stopCamera = async () => {
        const scanner = scannerRef.current;

        if (!scanner) {
            setCameraActive(false);
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
            setCameraActive(false);
            startingRef.current = false;
        }
    };

    // Release camera when component unmounts
    useEffect(() => {
        return () => {
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

    // Start QR scanning
    const startCamera = async () => {
        if (startingRef.current || cameraActive) return;

        startingRef.current = true;
        setError("");
        setDetectedValue("");

        if (!window.isSecureContext) {
            setError(
                "Camera requires HTTPS or localhost. Open PayWave using a secure URL."
            );
            startingRef.current = false;
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            setError(
                "Camera access is unavailable. Please use a supported browser."
            );
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
                    qrbox: {
                        width: 250,
                        height: 250,
                    },
                    aspectRatio: 1,
                },
                async (decodedText) => {
                    setDetectedValue(decodedText);
                    await stopCamera();
                },
                () => {
                    // Ignore individual unsuccessful frame scans.
                }
            );

            setCameraActive(true);
        } catch (err) {
            console.error("QR scanner error:", err);

            const message = String(err?.message || err).toLowerCase();

            if (
                err?.name === "NotAllowedError" ||
                message.includes("permission")
            ) {
                setError(
                    "Camera permission denied. Allow camera access in your browser settings."
                );
            } else if (
                err?.name === "NotFoundError" ||
                message.includes("no camera")
            ) {
                setError("No camera was found on this device.");
            } else {
                setError(
                    "Unable to start camera. Check camera permission and try again."
                );
            }

            await stopCamera();
        } finally {
            startingRef.current = false;
        }
    };

    // Manual UPI ID / QR content entry
    const handleManualSubmit = (event) => {
        event.preventDefault();

        const value = manualId.trim();

        if (!value) {
            setError("Please enter a UPI ID or QR content.");
            return;
        }

        setError("");
        setDetectedValue(value);
        setManualId("");
    };

    // Reset scanner
    const handleReset = () => {
        setDetectedValue("");
        setError("");
        setManualId("");
    };

    // Extract UPI payment information
    const getDisplayValue = (value) => {
        if (value.toLowerCase().startsWith("upi://")) {
            try {
                const url = new URL(value);

                return {
                    type: "UPI Payment QR",
                    recipient:
                        url.searchParams.get("pn") || "Unknown recipient",
                    upiId:
                        url.searchParams.get("pa") || "Not available",
                    amount:
                        url.searchParams.get("am") || "Not specified",
                };
            } catch {
                return {
                    type: "QR Content",
                    recipient: value,
                    upiId: "Not available",
                    amount: "Not specified",
                };
            }
        }

        return {
            type: "QR Content",
            recipient: value,
            upiId: "Not available",
            amount: "Not specified",
        };
    };

    const scannedDetails = detectedValue
        ? getDisplayValue(detectedValue)
        : null;

    return (
        <main className="scan-page">

            {/* Header */}
            <header className="scan-header">
                <button
                    type="button"
                    className="scan-back-button"
                    onClick={async () => {
                        await stopCamera();
                        onBack();
                    }}
                    aria-label="Go back"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                </button>

                <div>
                    <h2>Scan QR Code</h2>
                    <p>Scan and pay with PayWave</p>
                </div>
            </header>

            {!detectedValue ? (
                <>
                    {/* Instructions */}
                    <section className="scan-intro">
                        <span className="scan-eyebrow">
                            QUICK & EASY
                        </span>

                        <h1>Point. Scan. Done.</h1>

                        <p>
                            Place the QR code inside the frame to detect
                            the payment details.
                        </p>
                    </section>

                    {/* Camera Area */}
                    <section className="scan-camera-card">

                        <div
                            className={`scan-camera-view ${
                                cameraActive ? "active" : ""
                            }`}
                        >
                            {/* html5-qrcode injects camera video here */}
                            <div
                                id="qr-reader"
                                className="scan-video"
                            />

                            {!cameraActive && (
                                <div className="scan-camera-placeholder">
                                    <div className="scan-placeholder-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="42"
                                            height="42"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 8V5a1 1 0 0 1 1-1h3" />
                                            <path d="M16 4h3a1 1 0 0 1 1 1v3" />
                                            <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
                                            <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
                                            <path d="M8 8h3v3H8zM14 8h2v2h-2zM14 14h3v3h-3z" />
                                        </svg>
                                    </div>

                                    <h3>Camera is ready</h3>

                                    <p>
                                        Start scanning to activate your camera
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

                        <p className="scan-camera-caption">
                            {cameraActive
                                ? "Scanning for QR code..."
                                : "Camera preview will appear here"}
                        </p>

                        <button
                            type="button"
                            className={`scan-camera-button ${
                                cameraActive ? "stop" : ""
                            }`}
                            onClick={
                                cameraActive
                                    ? stopCamera
                                    : startCamera
                            }
                        >
                            {cameraActive
                                ? "Stop Scanning"
                                : "Start Scanning"}
                        </button>
                    </section>

                    {/* Error */}
                    {error && (
                        <div className="scan-error">
                            {error}
                        </div>
                    )}

                    {/* Manual Entry */}
                    <section className="scan-manual-section">
                        <div className="scan-or-divider">
                            <span />
                            <p>OR ENTER MANUALLY</p>
                            <span />
                        </div>

                        <form onSubmit={handleManualSubmit}>
                            <label htmlFor="manual-upi">
                                UPI ID or QR content
                            </label>

                            <input
                                id="manual-upi"
                                type="text"
                                value={manualId}
                                onChange={(event) =>
                                    setManualId(event.target.value)
                                }
                                placeholder="example@upi"
                            />

                            <button type="submit">
                                Continue
                            </button>
                        </form>
                    </section>
                </>
            ) : (
                /* Scan Result */
                <section className="scan-result-card">
                    <div className="scan-success-icon">
                        <svg
                            viewBox="0 0 24 24"
                            width="34"
                            height="34"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m5 12 4 4L19 6" />
                        </svg>
                    </div>

                    <span className="scan-eyebrow">
                        QR DETECTED
                    </span>

                    <h1>Scan successful!</h1>

                    <p className="scan-result-subtitle">
                        We found the following information.
                    </p>

                    <div className="scan-result-details">
                        <div>
                            <span>QR Type</span>
                            <strong>{scannedDetails.type}</strong>
                        </div>

                        <div>
                            <span>Recipient</span>
                            <strong>{scannedDetails.recipient}</strong>
                        </div>

                        <div>
                            <span>UPI ID</span>
                            <strong>{scannedDetails.upiId}</strong>
                        </div>

                        <div>
                            <span>Amount</span>
                            <strong>
                                {scannedDetails.amount === "Not specified"
                                    ? "Not specified"
                                    : `₹${scannedDetails.amount}`}
                            </strong>
                        </div>
                    </div>

                    <div className="scan-demo-notice">
                        This is a demo scan. No payment has been initiated.
                    </div>

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

            <p className="scan-disclaimer">
                PayWave is an educational payment simulation.
                No real money is transferred.
            </p>
        </main>
    );
}

export default ScanQR;
