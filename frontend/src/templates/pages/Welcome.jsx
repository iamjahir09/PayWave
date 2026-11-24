
import "../../static/css/Welcome.css";

function Welcome({ onLogin, onCreateAccount }) {
  return (
    <main className="welcome-page">

      {/* Top branding */}
      <header className="welcome-header">
        <div className="welcome-brand">
          <div className="welcome-logo">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
      </header>

      {/* Main content */}
      <section className="welcome-content">

        <div className="welcome-security-badge">
          <span className="welcome-security-icon">✦</span>
          Bank-grade security standards
        </div>

        <h1>
          Welcome to PayWave
        </h1>

        <p className="welcome-description">
          Simple, secure and seamless payments.
        </p>

      </section>

      {/* Bottom actions */}
      <section className="welcome-actions">

        <button
          type="button"
          className="welcome-login-btn"
          onClick={onLogin}
        >
          <span className="welcome-button-content">
            <strong>Login</strong>
            <small>Existing users • Registered mobile</small>
          </span>

          <span className="welcome-arrow">→</span>
        </button>

        <button
          type="button"
          className="welcome-register-btn"
          onClick={onCreateAccount}
        >
          Create Account
        </button>

        <div className="welcome-trust">
          <span>♙</span>
          End-to-end encrypted • RBI authorized rails
        </div>

        <p className="welcome-footer">
          Your payments, your control.
        </p>

        <div className="welcome-home-indicator" />

      </section>

    </main>
  );
}

export default Welcome;
