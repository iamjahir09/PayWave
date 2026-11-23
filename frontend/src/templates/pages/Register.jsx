
import { useState } from "react";
import "../../static/css/Register.css";

import { registerUser } from "../services/paywaveApi";
import { getApiError } from "../services/apiClient";

function Register({ onRegister, onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    mpin: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
          name === "mobileNumber" || name === "mpin"
              ? value.replace(/\D/g, "")
              : value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password.length > 72) {
      setError("Password cannot exceed 72 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^\d{6}$/.test(formData.mpin)) {
      setError("MPIN must contain exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      // Send registration details to Spring Boot backend.
      // Backend saves the user and creates their wallet in MySQL.
      const response = await registerUser({
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        mpin: formData.mpin,
      });

      // Registration succeeded. Do not store the password or MPIN.
      // Move to login so the user authenticates with their credentials.
      onRegister({
        name: response.data?.name || formData.name.trim(),
        mobileNumber: formData.mobileNumber,
        email: response.data?.email || formData.email.trim(),
      });

    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="register-page">

        <div className="register-top">

          <div className="register-brand">
            <div className="register-brand-icon">P</div>
            <h1>PayWave<span>.</span></h1>
          </div>

          <div className="register-welcome">
            <span className="register-label">GET STARTED</span>

            <h2>Make money moves<span>.</span></h2>

            <p>
              Create your account and experience
              simpler digital payments.
            </p>
          </div>

        </div>

        <div className="register-card">

          <div className="register-form-heading">
            <h3>Create your account</h3>
            <p>Fill in your details to join PayWave.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="register-form-group">
              <label htmlFor="registerName">Full Name</label>

              <input
                  id="registerName"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="registerMobile">Mobile Number</label>

              <div className="register-input-wrapper">
                <span className="register-prefix">+91</span>

                <input
                    id="registerMobile"
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

            <div className="register-form-group">
              <label htmlFor="registerEmail">Email Address</label>

              <input
                  id="registerEmail"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="registerPassword">Password</label>

              <div className="register-input-wrapper">
                <input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                />

                <button
                    type="button"
                    className="register-toggle"
                    onClick={() =>
                        setShowPassword((previous) => !previous)
                    }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small>Use at least 8 characters.</small>
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="registerMpin">Create App MPIN</label>

              <div className="register-input-wrapper">
                <input
                    id="registerMpin"
                    type={showMpin ? "text" : "password"}
                    name="mpin"
                    placeholder="Enter 6-digit MPIN"
                    value={formData.mpin}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="new-password"
                    required
                />

                <button
                    type="button"
                    className="register-toggle"
                    onClick={() =>
                        setShowMpin((previous) => !previous)
                    }
                >
                  {showMpin ? "Hide" : "Show"}
                </button>
              </div>

              <small>This MPIN will be used for app login.</small>
            </div>

            {error && (
                <div className="register-error" role="alert">
                  {error}
                </div>
            )}

            <button
                type="submit"
                className="register-submit"
                disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              <span>→</span>
            </button>

          </form>

          <div className="register-login">
            <p>Already have a PayWave account?</p>

            <button
                type="button"
                onClick={onLogin}
                disabled={loading}
            >
              Login instead
            </button>
          </div>

        </div>

        <div className="register-security">
          <span>◆</span>
          Your security is our priority.
        </div>

      </main>
  );
}

export default Register;
