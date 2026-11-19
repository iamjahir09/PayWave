
import { useState } from "react";
import "../../static/css/ServicePayment.css";

const serviceConfig = {
  "Mobile Recharge": {
    subtitle: "Recharge your mobile number",
    field: "Mobile Number",
    placeholder: "Enter 10-digit mobile number",
    inputMode: "numeric",
  },
  Electricity: {
    subtitle: "Pay your electricity bill",
    field: "Consumer Number",
    placeholder: "Enter consumer number",
    inputMode: "text",
  },
  "DTH Recharge": {
    subtitle: "Recharge your DTH connection",
    field: "Customer ID",
    placeholder: "Enter DTH customer ID",
    inputMode: "text",
  },
  "Water Bill": {
    subtitle: "Pay your water bill",
    field: "Connection Number",
    placeholder: "Enter connection number",
    inputMode: "text",
  },
};

function ServicePayment({ service = "Mobile Recharge", onBack }) {
  const config = serviceConfig[service] || serviceConfig["Mobile Recharge"];

  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [step, setStep] = useState("form");
  const [message, setMessage] = useState("");

  const handleContinue = (event) => {
    event.preventDefault();

    if (!customerId.trim()) {
      setMessage(`Please enter your ${config.field.toLowerCase()}.`);
      return;
    }

    if (
      service === "Mobile Recharge" &&
      !/^[0-9]{10}$/.test(customerId)
    ) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (service === "Mobile Recharge" || service === "DTH Recharge") {
      if (!operator) {
        setMessage("Please select an operator.");
        return;
      }
    }

    setMessage("");
    setStep("review");
  };

  const handleConfirm = () => {
    setStep("success");
  };

  const handleReset = () => {
    setCustomerId("");
    setAmount("");
    setOperator("");
    setMessage("");
    setStep("form");
  };

  return (
    <main className="service-page">
      <header className="service-header">
        <button className="service-back" onClick={onBack}>←</button>
        <div>
          <h2>{service}</h2>
          <p>{config.subtitle}</p>
        </div>
      </header>

      {step === "form" && (
        <>
          <section className="service-banner">
            <span className="service-banner-icon">₹</span>
            <h1>Pay with PayWave</h1>
            <p>Simple, quick and convenient demo payments.</p>
          </section>

          <form className="service-form" onSubmit={handleContinue}>
            <label>{config.field}</label>
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder={config.placeholder}
              inputMode={config.inputMode}
              maxLength={service === "Mobile Recharge" ? 10 : 40}
            />

            {(service === "Mobile Recharge" || service === "DTH Recharge") && (
              <>
                <label>Operator</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  <option value="">Select operator</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                  {service === "DTH Recharge" && (
                    <>
                      <option value="Tata Play">Tata Play</option>
                      <option value="Dish TV">Dish TV</option>
                      <option value="Sun Direct">Sun Direct</option>
                    </>
                  )}
                </select>
              </>
            )}

            <label>Amount (₹)</label>
            <input
              type="number"
              min="1"
              max="100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <div className="service-quick-amounts">
              {[100, 199, 299, 499].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAmount(String(value))}
                >
                  ₹{value}
                </button>
              ))}
            </div>

            {message && <p className="service-error">{message}</p>}

            <button className="service-primary" type="submit">
              Continue
            </button>
          </form>
        </>
      )}

      {step === "review" && (
        <section className="service-result">
          <div className="service-result-icon">₹</div>
          <h2>Review Payment</h2>
          <p>Check the details before continuing.</p>

          <div className="service-summary">
            <div><span>Service</span><strong>{service}</strong></div>
            <div><span>{config.field}</span><strong>{customerId}</strong></div>
            {operator && <div><span>Operator</span><strong>{operator}</strong></div>}
            <div><span>Amount</span><strong>₹{Number(amount).toLocaleString("en-IN")}</strong></div>
            <div><span>Payment mode</span><strong>PayWave Demo</strong></div>
          </div>

          <button className="service-primary" onClick={handleConfirm}>
            Confirm Demo Payment
          </button>
          <button className="service-secondary" onClick={() => setStep("form")}>
            Edit Details
          </button>
        </section>
      )}

      {step === "success" && (
        <section className="service-result">
          <div className="service-success-icon">✓</div>
          <h2>Demo Payment Successful!</h2>
          <p>Your simulated payment flow is complete.</p>

          <div className="service-summary">
            <div><span>Service</span><strong>{service}</strong></div>
            <div><span>Reference</span><strong>PW-DEMO-{Date.now().toString().slice(-6)}</strong></div>
            <div><span>Amount</span><strong>₹{Number(amount).toLocaleString("en-IN")}</strong></div>
            <div><span>Status</span><strong className="service-status">Demo Success</strong></div>
          </div>

          <button className="service-primary" onClick={handleReset}>
            Make Another Payment
          </button>
          <button className="service-secondary" onClick={onBack}>
            Back to Home
          </button>
        </section>
      )}

      <p className="service-disclaimer">
        Educational simulation only. No actual recharge, bill payment or money transfer occurs.
      </p>
    </main>
  );
}

export default ServicePayment;
