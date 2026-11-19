
import "../../static/css/Splash.css";

function Splash({ onGetStarted, onLogin }) {
  return (
    <main className="splash-page">
      <div className="splash-top">
        <div className="splash-brand">
          <div className="splash-logo">P</div>
          <h1>PayWave<span>.</span></h1>
        </div>

        <div className="splash-illustration">
          <div className="splash-circle splash-circle-one"></div>
          <div className="splash-circle splash-circle-two"></div>

          <div className="splash-card">
            <div className="splash-card-top">
              <span className="splash-card-chip">▦</span>
              <span className="splash-card-dots">•••</span>
            </div>

            <div className="splash-card-label">YOUR BALANCE</div>
            <div className="splash-card-amount">₹ XXXXXX.XX</div>

            <div className="splash-card-bottom">
              <span>PAYWAVE WALLET</span>
              <span className="splash-card-mark">P.</span>
            </div>
          </div>

          <div className="splash-float splash-float-send">
            <span>↗</span>
            <div>
              <strong>Money sent</strong>
              <small>Payment successful</small>
            </div>
          </div>

          <div className="splash-float splash-float-receive">
            <span>↙</span>
            <div>
              <strong>Money received</strong>
              <small>Transaction successful</small>
            </div>
          </div>
        </div>
      </div>

      <section className="splash-content">
        <span className="splash-eyebrow">SIMPLE. SMART. SECURE.</span>

        <h2>
          Your money.
          <br />
          Your <span>control.</span>
        </h2>

        <p>
          One simple place to manage your payments,
          track transactions and stay in control.
        </p>

        <button className="splash-primary-btn" onClick={onGetStarted}>
          Get Started <span>→</span>
        </button>

        <button className="splash-login-btn" onClick={onLogin}>
          Already have an account? <strong>Login</strong>
        </button>

        <div className="splash-footer">
          <span>◆</span> A smarter way to manage payments
        </div>

        <p className="splash-disclaimer">
          Educational payment simulation. No real money is transferred.
        </p>
      </section>
    </main>
  );
}

export default Splash;
