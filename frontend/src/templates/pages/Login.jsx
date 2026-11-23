
import { useState } from "react";
import "../../static/css/Login.css";

import { loginUser } from "../services/paywaveApi";
import { getApiError } from "../services/apiClient";

function Login({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mpin: "",
  });

  const [showMpin, setShowMpin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value.replace(/\D/g, ""),
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(formData.mpin)) {
      setError("MPIN must contain exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      // Authenticate user using backend and MySQL database
      const response = await loginUser({
        mobileNumber: formData.mobileNumber,
        mpin: formData.mpin,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error(
            "Authentication token was not received from the server."
        );
      }

      // Persist JWT token across page refreshes
      localStorage.setItem("token", token);

      // Fetch authenticated user's profile from backend
      await onLogin();

    } catch (err) {
      // Clear token if authentication or profile loading fails
      localStorage.removeItem("token");

      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="login-page">

        <div className="login-top">
          <div className="login-brand">
            <div className="login-brand-icon">P</div>
            <h1>
              PayWave<span>.</span>
            </h1>
          </div>

          <div className="login-welcome">
            <span className="welcome-label">WELCOME BACK</span>
            <h2>
              Good to see you<span>.</span>
            </h2>
            <p>Login to continue your payment journey.</p>
          </div>
        </div>

        <div className="login-card">

          <form onSubmit={handleSubmit}>

            <div className="login-form-heading">
              <h3>Login to your account</h3>
              <p>Enter your registered mobile number and MPIN.</p>
            </div>

            <div className="login-form-group">
              <label htmlFor="loginMobile">Mobile Number</label>

              <div className="login-input-wrapper">
                <span className="input-prefix">+91</span>

                <input
                    id="loginMobile"
                    type="tel"
                    name="mobileNumber"
                    placeholder="10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="loginMpin">App MPIN</label>

              <div className="login-input-wrapper">
                <input
                    id="loginMpin"
                    type={showMpin ? "text" : "password"}
                    name="mpin"
                    placeholder="Enter your 6-digit MPIN"
                    value={formData.mpin}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="current-password"
                    required
                />

                <button
                    type="button"
                    className="mpin-toggle"
                    onClick={() =>
                        setShowMpin((previous) => !previous)
                    }
                >
                  {showMpin ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
            )}

            <button
                type="submit"
                className="login-submit"
                disabled={loading}
            >
              {loading ? "Logging in..." : "Login to PayWave"}
              <span>→</span>
            </button>

          </form>

          <div className="login-register">
            <p>New to PayWave?</p>

            <button
                type="button"
                onClick={onRegister}
                disabled={loading}
            >
              Create an account
            </button>
          </div>

        </div>

        <div className="login-security">
          <span>◆</span>
          Your security is our priority.
        </div>

      </main>
  );
}

export default Login;
