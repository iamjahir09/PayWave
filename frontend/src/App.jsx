
import { useEffect, useState } from "react";

// Authentication screens
import Splash from "./templates/pages/Splash";
import Welcome from "./templates/pages/Welcome";
import Register from "./templates/pages/Register";
import Login from "./templates/pages/Login";
import OTPVerification from "./templates/pages/OTPVerification";

// Main screens
import Home from "./templates/pages/Home";
import BankAccounts from "./templates/pages/BankAccounts";
import History from "./templates/pages/History";
import Wallet from "./templates/pages/Wallet";
import Profile from "./templates/pages/Profile";
import SendMoney from "./templates/pages/SendMoney";
import ReceiveMoney from "./templates/pages/ReceiveMoney";
import ScanQR from "./templates/pages/ScanQR";

// Additional features
import ServicePayment from "./templates/pages/ServicePayment";
import SplitExpenses from "./templates/pages/SplitExpenses";
import RequestMoney from "./templates/pages/RequestMoney";
import PaymentReminders from "./templates/pages/PaymentReminders";

// API
import api from "./templates/services/apiClient";
import {
    getMyProfile,
    logoutUser,
} from "./templates/services/paywaveApi";

import "./static/css/App.css";

function App() {
    const [currentPage, setCurrentPage] = useState("splash");
    const [selectedService, setSelectedService] = useState("");

    const [user, setUser] = useState(null);

    const [loginMobile, setLoginMobile] = useState("");
    const [demoOtp, setDemoOtp] = useState("");

    const [checkingSession, setCheckingSession] = useState(true);

    // =====================================
    // LOAD USER PROFILE
    // =====================================

    const loadProfile = async () => {
        const response = await getMyProfile();
        const profile = response.data;

        const userData = {
            userId: profile.userId,
            name: profile.name || "",
            mobileNumber: profile.mobileNumber || "",
            email: profile.email || "",
            paywaveId: profile.paywaveId || "",
        };

        setUser(userData);
        return userData;
    };

    // =====================================
    // RESTORE LOGIN SESSION
    // =====================================

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                if (active) {
                    setUser(null);
                    setCurrentPage("splash");
                    setCheckingSession(false);
                }
                return;
            }

            try {
                const response = await getMyProfile();

                if (!active) return;

                const profile = response.data;

                setUser({
                    userId: profile.userId,
                    name: profile.name || "",
                    mobileNumber: profile.mobileNumber || "",
                    email: profile.email || "",
                    paywaveId: profile.paywaveId || "",
                });

                setCurrentPage("home");

            } catch (error) {
                if (!active) return;

                console.error("Session restoration failed:", error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    setUser(null);
                    setCurrentPage("splash");
                } else {
                    setCurrentPage("login");
                }

            } finally {
                if (active) {
                    setCheckingSession(false);
                }
            }
        };

        restoreSession();

        return () => {
            active = false;
        };
    }, []);

    // =====================================
    // REGISTRATION COMPLETED
    // =====================================

    const handleRegister = () => {
        setCurrentPage("login");
    };

    // =====================================
    // SEND OTP
    // =====================================

    const handleLoginContinue = async (mobileNumber) => {
        try {
            const response = await api.post(
                "/api/auth/send-otp",
                { mobileNumber }
            );

            setLoginMobile(mobileNumber);
            setDemoOtp(response.data.demoOtp || "");
            setCurrentPage("otp");

        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to generate OTP. Please try again."
            );
        }
    };

    // =====================================
    // RESEND OTP
    // =====================================

    const handleOtpResend = async () => {
        try {
            const response = await api.post(
                "/api/auth/send-otp",
                { mobileNumber: loginMobile }
            );

            setDemoOtp(response.data.demoOtp || "");

            return response.data;

        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to resend OTP."
            );
        }
    };

    // =====================================
    // VERIFY OTP AND LOGIN
    // =====================================

    const handleLogin = async (enteredOtp) => {
        try {
            const response = await api.post(
                "/api/auth/verify-otp",
                {
                    mobileNumber: loginMobile,
                    otp: enteredOtp,
                }
            );

            const token = response.data.token;

            if (!token) {
                throw new Error("Authentication token not received.");
            }

            localStorage.setItem("token", token);

            await loadProfile();

            setDemoOtp("");
            setCurrentPage("home");

        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "OTP verification failed."
            );
        }
    };

    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = async () => {
        try {
            await logoutUser();

        } catch (error) {
            console.error("Logout API failed:", error);

        } finally {
            localStorage.removeItem("token");

            setUser(null);
            setLoginMobile("");
            setDemoOtp("");

            setCurrentPage("welcome");
        }
    };

    // =====================================
    // OPEN PAYMENT SERVICE
    // =====================================

    const handleOpenService = (serviceName) => {
        setSelectedService(serviceName);
        setCurrentPage("servicePayment");
    };

    // =====================================
    // RETURN HOME
    // =====================================

    const goHome = () => {
        setCurrentPage("home");
    };

    // =====================================
    // SESSION LOADING
    // =====================================

    if (checkingSession) {
        return (
            <div className="app-container">
                <div className="app-loading">
                    Loading PayWave...
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">

            {/* SPLASH */}

            {currentPage === "splash" && (
                <Splash
                    onGetStarted={() => setCurrentPage("welcome")}
                />
            )}

            {/* WELCOME */}

            {currentPage === "welcome" && (
                <Welcome
                    onLogin={() => setCurrentPage("login")}
                    onCreateAccount={() => setCurrentPage("register")}
                />
            )}

            {/* REGISTER */}

            {currentPage === "register" && (
                <Register
                    onRegister={handleRegister}
                    onLogin={() => setCurrentPage("login")}
                />
            )}

            {/* LOGIN */}

            {currentPage === "login" && (
                <Login
                    onContinue={handleLoginContinue}
                    onRegister={() => setCurrentPage("register")}
                    onBack={() => setCurrentPage("welcome")}
                />
            )}

            {/* OTP VERIFICATION */}

            {currentPage === "otp" && (
                <OTPVerification
                    mobileNumber={loginMobile}
                    demoOtp={demoOtp}
                    onBack={() => setCurrentPage("login")}
                    onVerified={handleLogin}
                    onResend={handleOtpResend}
                />
            )}

            {/* HOME */}

            {currentPage === "home" && user && (
                <Home
                    user={user}
                    onLogout={handleLogout}

                    onOpenBankAccounts={() =>
                        setCurrentPage("bankAccounts")
                    }

                    onOpenHistory={() =>
                        setCurrentPage("history")
                    }

                    onOpenWallet={() =>
                        setCurrentPage("wallet")
                    }

                    onOpenProfile={() =>
                        setCurrentPage("profile")
                    }

                    onOpenSendMoney={() =>
                        setCurrentPage("sendMoney")
                    }

                    onOpenReceiveMoney={() =>
                        setCurrentPage("receiveMoney")
                    }

                    onOpenScanQR={() =>
                        setCurrentPage("scanQR")
                    }

                    onOpenService={handleOpenService}

                    onOpenSplitExpenses={() =>
                        setCurrentPage("splitExpenses")
                    }

                    onOpenRequestMoney={() =>
                        setCurrentPage("requestMoney")
                    }

                    onOpenPaymentReminders={() =>
                        setCurrentPage("paymentReminders")
                    }
                />
            )}

            {/* BANK ACCOUNTS */}

            {currentPage === "bankAccounts" && user && (
                <BankAccounts onBack={goHome} />
            )}

            {/* HISTORY */}

            {currentPage === "history" && user && (
                <History onBack={goHome} />
            )}

            {/* WALLET */}

            {currentPage === "wallet" && user && (
                <Wallet onBack={goHome} />
            )}

            {/* PROFILE */}

            {currentPage === "profile" && user && (
                <Profile
                    user={user}
                    onBack={goHome}
                    onLogout={handleLogout}
                />
            )}

            {/* SEND MONEY */}

            {currentPage === "sendMoney" && user && (
                <SendMoney onBack={goHome} />
            )}

            {/* RECEIVE MONEY */}

            {currentPage === "receiveMoney" && user && (
                <ReceiveMoney
                    user={user}
                    onBack={goHome}
                />
            )}

            {/* SCAN QR */}

            {currentPage === "scanQR" && user && (
                <ScanQR onBack={goHome} />
            )}

            {/* SERVICE PAYMENT */}

            {currentPage === "servicePayment" && user && (
                <ServicePayment
                    service={selectedService}
                    onBack={goHome}
                />
            )}

            {/* SPLIT EXPENSES */}

            {currentPage === "splitExpenses" && user && (
                <SplitExpenses onBack={goHome} />
            )}

            {/* REQUEST MONEY */}

            {currentPage === "requestMoney" && user && (
                <RequestMoney onBack={goHome} />
            )}

            {/* PAYMENT REMINDERS */}

            {currentPage === "paymentReminders" && user && (
                <PaymentReminders onBack={goHome} />
            )}

        </div>
    );
}

export default App;
