
import { useEffect } from "react";
import "../../static/css/Splash.css";

function Splash({ onGetStarted }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onGetStarted?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onGetStarted]);

  return (
      <main className="splash-page">
        <section className="splash-brand">
          <div className="splash-logo">
            <svg
                className="splash-logo-icon"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="PayWave logo"
            >
              <path
                  d="M17 29C21 23 26 23 31 29L34 32"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
              />

              <path
                  d="M47 35C43 41 38 41 33 35L30 32"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
              />

              <path
                  d="M17 39C21 33 26 33 31 39L34 42"
                  stroke="#AAB8CC"
                  strokeWidth="3"
                  strokeLinecap="round"
              />

              <circle cx="47" cy="17" r="5" fill="#E86A24" />
            </svg>
          </div>

          <h1 className="splash-title">PayWave</h1>

          <p className="splash-tagline">
            Payments made simpler.
          </p>
        </section>

        <div className="splash-loader" aria-label="Loading PayWave">
          <span className="splash-dot splash-dot-one" />
          <span className="splash-dot splash-dot-two" />
          <span className="splash-dot splash-dot-three" />
        </div>
      </main>
  );
}

export default Splash;
