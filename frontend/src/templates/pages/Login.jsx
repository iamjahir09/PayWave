
import { useState } from "react";
import { sendOtp } from "../services/paywaveApi";
import "../../static/css/Login.css";

function Login({ onContinue, onRegister, onBack }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await sendOtp(mobileNumber);
      const demoOtp = response.data.demoOtp;

      if (!demoOtp) {
        throw new Error("Demo OTP was not received from server.");
      }

      await onContinue(mobileNumber, demoOtp);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unable to continue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <header className="login-header">
        <button
          type="button"
          className="login-back"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="login-brand">
          <div className="login-brand-icon">
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

        <button type="button" className="login-help">
          <span>ⓘ</span> Help
        </button>
      </header>

      <section className="login-content">
        <h1>Welcome Back</h1>

        <p className="login-description">
          Enter your mobile number to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="loginMobile">Mobile Number</label>

            <div className="login-input-wrapper">
              <div className="login-country-code">
                <span className="login-india-flag">🇮🇳</span>
                <span>+91</span>
                <span className="login-country-arrow">⌄</span>
              </div>

              <input
                id="loginMobile"
                type="tel"
                name="mobileNumber"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel-national"
                required
              />
            </div>

            <div className="login-input-info">
              <span>Demo OTP verification</span>
              <span>{mobileNumber.length}/10</span>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {typeof error === "string"
                ? error
                : "Unable to send OTP. Please try again."}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={mobileNumber.length !== 10 || loading}
          >
            {loading ? "Sending OTP..." : "Continue"}
            <span>→</span>
          </button>
        </form>

        <p className="login-terms">
          By proceeding, you consent to PayWave's{" "}
          <a href="#terms">Terms of Service</a>
          {" "}and{" "}
          <a href="#privacy">Privacy Policy</a>.
        </p>
      </section>

      <div className="login-home-indicator" />
    </main>
  );
}

export default Login;
