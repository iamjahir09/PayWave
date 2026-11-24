
import { useEffect, useRef, useState } from "react";
import { sendOtp, verifyOtp } from "../services/paywaveApi";
import "../../static/css/OTPVerification.css";

function OTPVerification({
    mobileNumber,
    demoOtp,
    onBack,
    onVerified,
    onResend,
}) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState("");
    const [alternateMessage, setAlternateMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((previous) => Math.max(0, previous - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const maskedNumber = mobileNumber
        ? `+91 ${mobileNumber.slice(0, 2)}XXXXXX${mobileNumber.slice(-2)}`
        : "+91 XXXXXXXXXX";

    const handleChange = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const updatedOtp = [...otp];

        updatedOtp[index] = digit;

        setOtp(updatedOtp);
        setError("");
        setAlternateMessage("");

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();

        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const updatedOtp = Array(6).fill("");

        pasted.split("").forEach((digit, index) => {
            updatedOtp[index] = digit;
        });

        setOtp(updatedOtp);
        setError("");
        setAlternateMessage("");

        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleResend = async () => {
        if (timer > 0 || resending) return;

        try {
            setResending(true);
            setError("");
            setAlternateMessage("");

            const response = await sendOtp(mobileNumber);

            if (onResend) {
                await onResend(response.data.demoOtp);
            }

            setOtp(["", "", "", "", "", ""]);
            setTimer(30);
            inputRefs.current[0]?.focus();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to resend OTP. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    const handleAlternateMethod = (method) => {
        setError("");

        if (method === "whatsapp") {
            setAlternateMessage(
                "WhatsApp OTP delivery is not available in demo mode."
            );
        } else {
            setAlternateMessage(
                "Voice call verification is not available in demo mode."
            );
        }
    };

    const handleVerify = async (event) => {
        event.preventDefault();

        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setAlternateMessage("");

            const response = await verifyOtp(mobileNumber, enteredOtp);

            const token = response.data.token;

            if (!token) {
                throw new Error("Authentication token was not received.");
            }

            await onVerified(token);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "OTP verification failed. Please try again."
            );

            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="otp-page">
            <header className="otp-header">
                <button
                    type="button"
                    className="otp-back-button"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    ←
                </button>

                <div className="otp-brand">
                    <div className="otp-brand-icon">
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

                    <span>PayWave</span>
                </div>

                <button
                    type="button"
                    className="otp-help"
                    onClick={() =>
                        setAlternateMessage(
                            "For assistance, please contact PayWave support."
                        )
                    }
                >
                    <span>ⓘ</span> Help
                </button>
            </header>

            <section className="otp-content">
                <div className="otp-label">
                    <span>▣</span>
                    TWO-FACTOR AUTHENTICATION
                </div>

                <h1>Enter Verification Code</h1>

                <p className="otp-description">
                    Enter the 6-digit demo verification code for
                </p>

                <div className="otp-mobile-row">
                    <strong>{maskedNumber}</strong>

                    <button type="button" onClick={onBack}>
                        Edit ✎
                    </button>
                </div>

                {/* DEMO OTP DISPLAY */}
                <div
                    style={{
                        margin: "16px 0",
                        padding: "14px",
                        borderRadius: "12px",
                        background: "#fff4e9",
                        border: "1px solid #f3c79f",
                        color: "#7c4218",
                    }}
                >
                    <strong>Demo OTP: </strong>
                    <span style={{ fontSize: "20px", letterSpacing: "4px" }}>
                        {demoOtp || "------"}
                    </span>

                </div>

                <form onSubmit={handleVerify}>
                    <label className="otp-field-label">
                        6-DIGIT SECURITY CODE
                    </label>

                    <div className="otp-inputs" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete={
                                    index === 0 ? "one-time-code" : "off"
                                }
                                maxLength={1}
                                value={digit}
                                onChange={(event) =>
                                    handleChange(index, event.target.value)
                                }
                                onKeyDown={(event) =>
                                    handleKeyDown(index, event)
                                }
                                aria-label={`OTP digit ${index + 1}`}
                            />
                        ))}
                    </div>



                    <button
                        type="button"
                        className="otp-resend"
                        disabled={timer > 0 || resending}
                        onClick={handleResend}
                    >
                        <span>Resend OTP</span>

                        <strong>
                            {resending
                                ? "Sending..."
                                : timer > 0
                                    ? `00:${String(timer).padStart(2, "0")}`
                                    : "Resend"}
                        </strong>
                    </button>
                    <div className="otp-alternatives">

                        {/* WHATSAPP */}
                        <button
                            type="button"
                            onClick={() => handleAlternateMethod("whatsapp")}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.5a8.5 8.5 0 1 1 16.3-4Z" />
                                <path d="M8 8.5c.5 2.7 2.1 4.3 4.8 5" />
                                <path d="M8.5 8.2l1.2-.5 1.1 1.8-1 .8" />
                                <path d="M14.5 12.7l.8-1 1.8 1.1-.5 1.2" />
                            </svg>

                            <span>Get via WhatsApp</span>
                        </button>

                        {/* PHONE CALL */}
                        <button
                            type="button"
                            onClick={() => handleAlternateMethod("call")}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.79a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.83.58 2.79.7A2 2 0 0 1 22 16.92Z" />
                            </svg>

                            <span>Call with Code</span>
                        </button>

                    </div>

                    {alternateMessage && (
                        <div
                            className="otp-alternate-message"
                            role="status"
                        >
                            <span>ⓘ</span>
                            {alternateMessage}
                        </div>
                    )}

                    {error && (
                        <div className="otp-error" role="alert">
                            {typeof error === "string"
                                ? error
                                : "OTP verification failed."}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="otp-verify-button"
                        disabled={otp.join("").length !== 6 || loading}
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                        <span>→</span>
                    </button>
                </form>


            </section>

            <div className="otp-home-indicator" />
        </main>
    );
}

export default OTPVerification;
