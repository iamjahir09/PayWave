
import { useEffect, useState } from "react";

import "../../static/css/BankAccounts.css";
import PayWaveIcon from "../../templates/components/PayWaveIcon";

import {
    getBankAccounts,
    linkBankAccount,
    verifyBankAccountOtp,
    checkBankBalance,
} from "../services/paywaveApi";

import { getApiError } from "../services/apiClient";

function BankAccounts({ onBack }) {
    // Linked accounts
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    // Link account form
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);
    const [linkError, setLinkError] = useState("");
    const [linkMessage, setLinkMessage] = useState("");

    const [bankForm, setBankForm] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
    });

    // OTP verification
    const [otpAccountId, setOtpAccountId] = useState(null);
    const [otp, setOtp] = useState("");
    const [demoOtp, setDemoOtp] = useState("");

    // Balance verification
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);

    const [balanceData, setBalanceData] = useState(null);
    const [balanceVisible, setBalanceVisible] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Fetch logged-in user's bank accounts
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setPageError("");

            const response = await getBankAccounts();

            setAccounts(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            setPageError(getApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // Update bank form fields
    const handleBankFormChange = (event) => {
        const { name, value } = event.target;

        setBankForm((previous) => ({
            ...previous,
            [name]:
                name === "ifscCode"
                    ? value.toUpperCase().replace(/\s/g, "")
                    : value,
        }));

        setLinkError("");
        setLinkMessage("");
    };

    // Submit bank account details
    const handleLinkAccount = async (event) => {
        event.preventDefault();

        setLinkError("");
        setLinkMessage("");

        const payload = {
            bankName: bankForm.bankName.trim(),
            accountNumber: bankForm.accountNumber.trim(),
            ifscCode: bankForm.ifscCode.trim().toUpperCase(),
            accountHolderName: bankForm.accountHolderName.trim(),
        };

        if (payload.bankName.length < 2) {
            setLinkError("Please enter a valid bank name.");
            return;
        }

        if (!/^\d{9,18}$/.test(payload.accountNumber)) {
            setLinkError("Account number must contain 9 to 18 digits.");
            return;
        }

        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(payload.ifscCode)) {
            setLinkError("Please enter a valid IFSC code.");
            return;
        }

        if (payload.accountHolderName.length < 2) {
            setLinkError("Please enter the account holder's name.");
            return;
        }

        try {
            setLinkLoading(true);

            const response = await linkBankAccount(payload);

            const data = response.data;

            if (!data?.bankAccountId) {
                throw new Error("Bank account ID was not received.");
            }

            setOtpAccountId(data.bankAccountId);
            setDemoOtp(data.demoOtp || "");
            setOtp("");

            setLinkMessage(
                data.message || "OTP generated successfully."
            );

            setShowLinkForm(false);

        } catch (err) {
            setLinkError(getApiError(err));
        } finally {
            setLinkLoading(false);
        }
    };

    // Verify bank account OTP
    const handleVerifyOtp = async (event) => {
        event.preventDefault();

        setLinkError("");
        setLinkMessage("");

        if (!/^\d{6}$/.test(otp)) {
            setLinkError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLinkLoading(true);

            const response = await verifyBankAccountOtp({
                bankAccountId: otpAccountId,
                otp,
            });

            const message =
                typeof response.data === "string"
                    ? response.data
                    : response.data?.message || "OTP verification completed.";

            setLinkMessage(message);

            if (message.toLowerCase().includes("successfully") ||
                message.toLowerCase().includes("already verified")) {

                setOtpAccountId(null);
                setDemoOtp("");
                setOtp("");

                setBankForm({
                    bankName: "",
                    accountNumber: "",
                    ifscCode: "",
                    accountHolderName: "",
                });

                await fetchAccounts();

            } else {
                setLinkError(message);
            }

        } catch (err) {
            setLinkError(getApiError(err));
        } finally {
            setLinkLoading(false);
        }
    };

    // Open balance verification
    const handleCheckBalance = (account) => {
        setSelectedAccount(account);
        setPin("");
        setError("");
        setBalanceData(null);
        setBalanceVisible(true);
    };

    // Verify MPIN and fetch simulated balance
    const handlePinSubmit = async (event) => {
        event.preventDefault();

        if (!selectedAccount || !/^\d{6}$/.test(pin)) {
            setError("Please enter your 6-digit MPIN.");
            return;
        }

        try {
            setChecking(true);
            setError("");

            const response = await checkBankBalance({
                bankAccountId: selectedAccount.id,
                mpin: pin,
            });

            setBalanceData(response.data);
            setBalanceVisible(true);
            setPin("");

        } catch (err) {
            setError(getApiError(err));
            setPin("");
        } finally {
            setChecking(false);
        }
    };

    // Return to account list or previous view
    const handleBack = () => {
        if (balanceData) {
            setBalanceData(null);
            setPin("");
            setError("");
            return;
        }

        if (selectedAccount) {
            setSelectedAccount(null);
            setPin("");
            setError("");
            return;
        }

        if (otpAccountId) {
            // Keep the OTP pending so it can still be verified.
            setOtp("");
            setLinkError("");
            setLinkMessage("");
            return;
        }

        if (showLinkForm) {
            setShowLinkForm(false);
            setLinkError("");
            setLinkMessage("");
            return;
        }

        onBack?.();
    };

    const formatBalance = (balance, currency = "INR") => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
        }).format(Number(balance));
    };

    const getAccountLastFour = (account) => {
        const value = account.maskedAccountNumber || "";
        return value.slice(-4);
    };

    return (
        <main className="bank-page">

            {/* HEADER */}
            <header className="bank-page-header">

                <button
                    type="button"
                    className="bank-back-button"
                    onClick={handleBack}
                    aria-label="Go back"
                >
                    ←
                </button>

                <div>
                    <h1>
                        {balanceData
                            ? "Account Balance"
                            : selectedAccount
                                ? "Account Verification"
                                : otpAccountId
                                    ? "OTP Verification"
                                    : showLinkForm
                                        ? "Link Bank Account"
                                        : "Bank Accounts"}
                    </h1>

                    <p>
                        {balanceData
                            ? "Your verified account balance"
                            : selectedAccount
                                ? "Verify your account securely"
                                : otpAccountId
                                    ? "Verify your bank account"
                                    : showLinkForm
                                        ? "Add a new bank account"
                                        : "Your linked bank accounts"}
                    </p>
                </div>

                <div className="bank-header-mark">
                    <PayWaveIcon
                        name="bank"
                        size={23}
                        color="#FFAD55"
                    />
                </div>

            </header>

            {/* ACCOUNT LIST */}
            {!selectedAccount && !showLinkForm && !otpAccountId && (
                <>
                    <section className="bank-intro">

            <span className="bank-eyebrow">
              YOUR MONEY SPACE
            </span>

                        <h2>All your accounts, in one place.</h2>

                        <p>
                            Choose a linked bank account to securely check its
                            available simulated balance.
                        </p>

                    </section>

                    <section className="linked-accounts-section">

                        <div className="linked-accounts-heading">
                            <h3>Linked Accounts</h3>
                            <span>{accounts.length} ACCOUNTS</span>
                        </div>

                        <button
                            type="button"
                            className="bank-check-button"
                            onClick={() => {
                                setShowLinkForm(true);
                                setLinkError("");
                                setLinkMessage("");
                            }}
                        >
                            <PayWaveIcon
                                name="bank"
                                size={19}
                                color="#172B3A"
                            />
                            Link Bank Account
                            <span>+</span>
                        </button>

                        {loading ? (
                            <p>Loading your bank accounts...</p>
                        ) : pageError ? (
                            <div>
                                <p className="bank-pin-error">{pageError}</p>

                                <button
                                    type="button"
                                    className="bank-check-button"
                                    onClick={fetchAccounts}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : accounts.length === 0 ? (
                            <div className="bank-security-note">
                                <PayWaveIcon
                                    name="bank"
                                    size={20}
                                    color="#16865C"
                                />

                                <p>
                                    No bank accounts linked yet. Link a bank account
                                    to see it here.
                                </p>
                            </div>
                        ) : (
                            <div className="linked-accounts-list">

                                {accounts.map((account) => (
                                    <article
                                        className="linked-bank-card"
                                        key={account.id}
                                    >

                                        <div className="linked-bank-top">

                                            <div className="linked-bank-logo">
                                                <PayWaveIcon
                                                    name="bank"
                                                    size={25}
                                                    color="#F28C28"
                                                />
                                            </div>

                                            <span className="linked-bank-status">
                        <span></span>
                                                {account.verified ? "VERIFIED" : "PENDING"}
                      </span>

                                        </div>

                                        <h4>{account.bankName}</h4>

                                        <p className="linked-account-type">
                                            {account.accountHolderName}
                                        </p>

                                        <div className="linked-account-number">
                                            <span>Account Number</span>

                                            <strong>
                                                •••• {getAccountLastFour(account)}
                                            </strong>
                                        </div>

                                        <p className="linked-account-type">
                                            IFSC: {account.ifscCode}
                                        </p>

                                        {account.primary && (
                                            <p className="linked-account-type">
                                                Primary Account
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            className="bank-check-button"
                                            onClick={() => handleCheckBalance(account)}
                                            disabled={!account.verified}
                                        >
                                            <PayWaveIcon
                                                name="security"
                                                size={19}
                                                color="#172B3A"
                                            />

                                            {account.verified
                                                ? "Check Balance"
                                                : "Verification Pending"}

                                            <span>→</span>
                                        </button>

                                    </article>
                                ))}

                            </div>
                        )}

                    </section>

                    <div className="bank-security-note">
                        <PayWaveIcon
                            name="security"
                            size={20}
                            color="#16865C"
                        />

                        <p>
                            Your balance remains private until you verify your
                            PayWave MPIN.
                        </p>
                    </div>
                </>
            )}

            {/* LINK BANK ACCOUNT FORM */}
            {showLinkForm && !otpAccountId && (
                <section className="account-verification">

                    <form
                        className="upi-pin-card"
                        onSubmit={handleLinkAccount}
                    >

                        <div className="pin-security-icon">
                            <PayWaveIcon
                                name="bank"
                                size={32}
                                color="#F28C28"
                            />
                        </div>

                        <span className="bank-eyebrow">
              ADD YOUR ACCOUNT
            </span>

                        <h2>Link Bank Account</h2>

                        <p>
                            Enter your bank account details to link it with
                            your PayWave account.
                        </p>

                        <label htmlFor="bankName">Bank Name</label>

                        <input
                            id="bankName"
                            className="upi-pin-input"
                            type="text"
                            name="bankName"
                            placeholder="e.g. State Bank of India"
                            value={bankForm.bankName}
                            onChange={handleBankFormChange}
                            maxLength={100}
                            required
                        />

                        <label htmlFor="accountHolderName">
                            Account Holder Name
                        </label>

                        <input
                            id="accountHolderName"
                            className="upi-pin-input"
                            type="text"
                            name="accountHolderName"
                            placeholder="Enter account holder name"
                            value={bankForm.accountHolderName}
                            onChange={handleBankFormChange}
                            maxLength={100}
                            required
                        />

                        <label htmlFor="accountNumber">
                            Account Number
                        </label>

                        <input
                            id="accountNumber"
                            className="upi-pin-input"
                            type="text"
                            name="accountNumber"
                            placeholder="Enter 9-18 digit account number"
                            value={bankForm.accountNumber}
                            onChange={(event) => {
                                setBankForm((previous) => ({
                                    ...previous,
                                    accountNumber: event.target.value.replace(/\D/g, ""),
                                }));
                                setLinkError("");
                            }}
                            maxLength={18}
                            inputMode="numeric"
                            required
                        />

                        <label htmlFor="ifscCode">IFSC Code</label>

                        <input
                            id="ifscCode"
                            className="upi-pin-input"
                            type="text"
                            name="ifscCode"
                            placeholder="e.g. SBIN0001234"
                            value={bankForm.ifscCode}
                            onChange={handleBankFormChange}
                            maxLength={11}
                            required
                        />

                        {linkError && (
                            <p className="bank-pin-error" role="alert">
                                {linkError}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="verify-pin-button"
                            disabled={linkLoading}
                        >
                            {linkLoading ? "Linking Account..." : "Continue"}
                            <span>→</span>
                        </button>

                        <div className="pin-privacy-note">
                            <PayWaveIcon
                                name="security"
                                size={16}
                                color="#16865C"
                            />

                            <span>
                This is a simulated bank-linking flow for the PayWave demo.
              </span>
                        </div>

                    </form>

                </section>
            )}

            {/* OTP VERIFICATION */}
            {otpAccountId && (
                <section className="account-verification">

                    <form
                        className="upi-pin-card"
                        onSubmit={handleVerifyOtp}
                    >

                        <div className="pin-security-icon">
                            <PayWaveIcon
                                name="security"
                                size={32}
                                color="#F28C28"
                            />
                        </div>

                        <span className="bank-eyebrow">
              ACCOUNT VERIFICATION
            </span>

                        <h2>Verify your bank account</h2>

                        <p>
                            Enter the 6-digit OTP generated for this demo account.
                        </p>

                        {demoOtp && (
                            <div className="bank-security-note">
                                <p>
                                    Demo OTP: <strong>{demoOtp}</strong>
                                </p>
                            </div>
                        )}

                        <label htmlFor="bankOtp">
                            6-digit OTP
                        </label>

                        <input
                            id="bankOtp"
                            className="upi-pin-input"
                            type="password"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="• • • • • •"
                            value={otp}
                            onChange={(event) => {
                                setOtp(event.target.value.replace(/\D/g, ""));
                                setLinkError("");
                            }}
                            required
                        />

                        {linkError && (
                            <p className="bank-pin-error" role="alert">
                                {linkError}
                            </p>
                        )}

                        {linkMessage && (
                            <p>{linkMessage}</p>
                        )}

                        <button
                            type="submit"
                            className="verify-pin-button"
                            disabled={otp.length !== 6 || linkLoading}
                        >
                            {linkLoading ? "Verifying..." : "Verify OTP"}
                            <span>→</span>
                        </button>

                        <div className="pin-privacy-note">
                            <PayWaveIcon
                                name="security"
                                size={16}
                                color="#16865C"
                            />

                            <span>
                OTP verification is handled by the backend.
              </span>
                        </div>

                    </form>

                </section>
            )}

            {/* BALANCE VERIFICATION */}
            {selectedAccount && (
                <section className="account-verification">

                    <div className="selected-bank-card">

                        <div className="selected-bank-logo">
                            <PayWaveIcon
                                name="bank"
                                size={29}
                                color="#FFAD55"
                            />
                        </div>

                        <div>
                            <h3>{selectedAccount.bankName}</h3>

                            <p>
                                Account ending •••• {getAccountLastFour(selectedAccount)}
                            </p>
                        </div>

                    </div>

                    {!balanceData ? (
                        <form
                            className="upi-pin-card"
                            onSubmit={handlePinSubmit}
                        >

                            <div className="pin-security-icon">
                                <PayWaveIcon
                                    name="security"
                                    size={32}
                                    color="#F28C28"
                                />
                            </div>

                            <span className="bank-eyebrow">
                SECURE VERIFICATION
              </span>

                            <h2>Enter your PayWave MPIN</h2>

                            <p>
                                Enter your 6-digit PayWave MPIN to view the
                                simulated balance of this account.
                            </p>

                            <label htmlFor="bankUpiPin">
                                6-digit PayWave MPIN
                            </label>

                            <input
                                id="bankUpiPin"
                                className="upi-pin-input"
                                type="password"
                                inputMode="numeric"
                                autoComplete="off"
                                maxLength={6}
                                placeholder="• • • • • •"
                                value={pin}
                                onChange={(event) => {
                                    setPin(event.target.value.replace(/\D/g, ""));
                                    setError("");
                                }}
                                required
                            />

                            {error && (
                                <p className="bank-pin-error" role="alert">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="verify-pin-button"
                                disabled={pin.length !== 6 || checking}
                            >
                                {checking ? "Verifying..." : "Verify & Check Balance"}
                                <span>→</span>
                            </button>

                            <div className="pin-privacy-note">
                                <PayWaveIcon
                                    name="security"
                                    size={16}
                                    color="#16865C"
                                />

                                <span>
                  Your MPIN is verified securely by the backend.
                </span>
                            </div>

                        </form>
                    ) : (
                        <div className="balance-result-card">

                            <div className="balance-result-top">
                                <span>ACCOUNT BALANCE</span>

                                <span className="balance-verified">
                  <span></span>
                  VERIFIED
                </span>
                            </div>

                            <div className="balance-result-icon">
                                <PayWaveIcon
                                    name="wallet"
                                    size={30}
                                    color="#FFAD55"
                                />
                            </div>

                            <p>Available Balance</p>

                            <h2>
                                {balanceVisible
                                    ? formatBalance(
                                        balanceData.balance,
                                        balanceData.currency
                                    )
                                    : "₹ ••••••"}
                            </h2>

                            <div className="balance-result-divider"></div>

                            <div className="balance-result-bank">
                                <span>{balanceData.bankName}</span>
                                <span>{balanceData.maskedAccountNumber}</span>
                            </div>

                            <button
                                type="button"
                                className="hide-balance-button"
                                onClick={() =>
                                    setBalanceVisible((previous) => !previous)
                                }
                            >
                                <PayWaveIcon
                                    name="security"
                                    size={18}
                                    color="#172B3A"
                                />

                                {balanceVisible ? "Hide Balance" : "Show Balance"}
                            </button>

                            <p className="balance-demo-note">
                                This is a simulated demo balance, not a real bank balance.
                            </p>

                        </div>
                    )}

                </section>
            )}

        </main>
    );
}

export default BankAccounts;
