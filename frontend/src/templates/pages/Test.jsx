
import { useEffect, useState } from "react";

// Authentication screens
import Splash from "./templates/pages/Splash";
import Welcome from "./templates/pages/Welcome";
import Register from "./templates/pages/Register";
import Login from "./templates/pages/Login";
import OTPVerification from "./templates/pages/OTPVerification";

// Main application screens
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

// Components
import PayWaveIcon from "./templates/components/PayWaveIcon";

// API services
import {
  getMyProfile,
  logoutUser,
} from "./templates/services/paywaveApi";

import "./static/css/App.css";

function App() {
  // =====================================
  // APPLICATION STATES
  // =====================================

  const [currentPage, setCurrentPage] = useState("splash");

  const [selectedService, setSelectedService] = useState("");

  const [user, setUser] = useState(null);

  const [loginMobile, setLoginMobile] = useState("");

  const [checkingSession, setCheckingSession] = useState(true);

  // Remember whether the user has already seen Welcome.
  const [hasSeenWelcome, setHasSeenWelcome] = useState(
    () => localStorage.getItem("paywave_welcome_seen") === "true"
  );

  // =====================================
  // WELCOME SCREEN PREFERENCE
  // =====================================

  const markWelcomeSeen = () => {
    localStorage.setItem("paywave_welcome_seen", "true");
    setHasSeenWelcome(true);
  };

  // First-time user sees Welcome.
  // Returning user goes directly to Login.
  const handleSplashContinue = () => {
    if (!hasSeenWelcome) {
      markWelcomeSeen();
      setCurrentPage("welcome");
    } else {
      setCurrentPage("login");
    }
  };

  // User chooses Login directly from Splash.
  const handleSplashLogin = () => {
    markWelcomeSeen();
    setCurrentPage("login");
  };

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
        });

        setCurrentPage("home");

      } catch (error) {
        if (!active) return;

        console.error(
          "Session restoration failed:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");

          setUser(null);
          setCurrentPage("splash");
        } else {
          // Preserve token during network/server errors.
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
    markWelcomeSeen();
    setCurrentPage("login");
  };

  // =====================================
  // LOGIN: MOBILE NUMBER SUBMITTED
  // =====================================

  const handleLoginContinue = (mobileNumber) => {
    setLoginMobile(mobileNumber);
    setCurrentPage("otp");
  };

  // =====================================
  // LOGIN COMPLETED
  // =====================================

  const handleLogin = async () => {
    try {
      await loadProfile();

      setCurrentPage("home");

    } catch (error) {
      console.error(
        "Unable to load user profile:",
        error
      );

      throw error;
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

      // Returning users should not see Welcome again.
      setCurrentPage("login");
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
    <div
      className={`app-container ${
        user ? "has-bottom-nav" : ""
      }`}
    >

      {/* =================================
          SPLASH SCREEN
      ================================= */}

      {currentPage === "splash" && (
        <Splash
          onGetStarted={handleSplashContinue}
          onLogin={handleSplashLogin}
        />
      )}

      {/* =================================
          WELCOME SCREEN
          FIRST-TIME USERS ONLY
      ================================= */}

      {currentPage === "welcome" && (
        <Welcome
          onLogin={() => setCurrentPage("login")}
          onCreateAccount={() => setCurrentPage("register")}
        />
      )}

      {/* =================================
          REGISTRATION SCREEN
      ================================= */}

      {currentPage === "register" && (
        <Register
          onRegister={handleRegister}
          onLogin={() => setCurrentPage("login")}
        />
      )}

      {/* =================================
          LOGIN SCREEN
      ================================= */}

      {currentPage === "login" && (
        <Login
          onContinue={handleLoginContinue}
          onRegister={() => setCurrentPage("register")}
          onBack={() => setCurrentPage("splash")}
        />
      )}

      {/* =================================
          OTP VERIFICATION
      ================================= */}

      {currentPage === "otp" && (
        <OTPVerification
          mobileNumber={loginMobile}
          onBack={() => setCurrentPage("login")}
        />
      )}

      {/* =================================
          HOME DASHBOARD
      ================================= */}

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

      {/* =================================
          BANK ACCOUNTS
      ================================= */}

      {currentPage === "bankAccounts" && user && (
        <BankAccounts onBack={goHome} />
      )}

      {/* =================================
          HISTORY
      ================================= */}

      {currentPage === "history" && user && (
        <History onBack={goHome} />
      )}

      {/* =================================
          WALLET
      ================================= */}

      {currentPage === "wallet" && user && (
        <Wallet onBack={goHome} />
      )}

      {/* =================================
          PROFILE
      ================================= */}

      {currentPage === "profile" && user && (
        <Profile
          user={user}
          onBack={goHome}
          onLogout={handleLogout}
        />
      )}

      {/* =================================
          SEND MONEY
      ================================= */}

      {currentPage === "sendMoney" && user && (
        <SendMoney onBack={goHome} />
      )}

      {/* =================================
          RECEIVE MONEY
      ================================= */}

      {currentPage === "receiveMoney" && user && (
        <ReceiveMoney
          user={user}
          onBack={goHome}
        />
      )}

      {/* =================================
          SCAN QR
      ================================= */}

      {currentPage === "scanQR" && user && (
        <ScanQR onBack={goHome} />
      )}

      {/* =================================
          SERVICE PAYMENT
      ================================= */}

      {currentPage === "servicePayment" && user && (
        <ServicePayment
          service={selectedService}
          onBack={goHome}
        />
      )}

      {/* =================================
          SPLIT EXPENSES
      ================================= */}

      {currentPage === "splitExpenses" && user && (
        <SplitExpenses onBack={goHome} />
      )}

      {/* =================================
          REQUEST MONEY
      ================================= */}

      {currentPage === "requestMoney" && user && (
        <RequestMoney onBack={goHome} />
      )}

      {/* =================================
          PAYMENT REMINDERS
      ================================= */}

      {currentPage === "paymentReminders" && user && (
        <PaymentReminders onBack={goHome} />
      )}

      {/* =================================
          GLOBAL BOTTOM NAVIGATION
      ================================= */}

      {user && (
        <nav className="bottom-navigation">

          <button
            className={`nav-item ${
              currentPage === "home" ? "active" : ""
            }`}
            type="button"
            onClick={() => setCurrentPage("home")}
          >
            <PayWaveIcon name="home" size={24} />
            <span>Home</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "history" ? "active" : ""
            }`}
            type="button"
            onClick={() => setCurrentPage("history")}
          >
            <PayWaveIcon name="history" size={24} />
            <span>History</span>
          </button>

          <button
            className={`nav-item scan-nav-item ${
              currentPage === "scanQR" ? "active" : ""
            }`}
            type="button"
            onClick={() => setCurrentPage("scanQR")}
          >
            <PayWaveIcon name="scan" size={24} />
            <span>Scan</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "wallet" ? "active" : ""
            }`}
            type="button"
            onClick={() => setCurrentPage("wallet")}
          >
            <PayWaveIcon name="wallet" size={24} />
            <span>Wallet</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "profile" ? "active" : ""
            }`}
            type="button"
            onClick={() => setCurrentPage("profile")}
          >
            <PayWaveIcon name="profile" size={24} />
            <span>Profile</span>
          </button>

        </nav>
      )}

    </div>
  );
}

export default App;
