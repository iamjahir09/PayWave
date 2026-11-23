
import { useEffect, useState } from "react";

import Splash from "./templates/pages/Splash";
import Register from "./templates/pages/Register";
import Login from "./templates/pages/Login";
import Home from "./templates/pages/Home";
import BankAccounts from "./templates/pages/BankAccounts";
import History from "./templates/pages/History";
import Wallet from "./templates/pages/Wallet";
import Profile from "./templates/pages/Profile";
import SendMoney from "./templates/pages/SendMoney";
import ReceiveMoney from "./templates/pages/ReceiveMoney";
import ScanQR from "./templates/pages/ScanQR";

import ServicePayment from "./templates/pages/ServicePayment";
import SplitExpenses from "./templates/pages/SplitExpenses";
import RequestMoney from "./templates/pages/RequestMoney";
import PaymentReminders from "./templates/pages/PaymentReminders";

import PayWaveIcon from "./templates/components/PayWaveIcon";

import {
  getMyProfile,
  logoutUser,
} from "./templates/services/paywaveApi";

import "./static/css/App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("splash");
  const [selectedService, setSelectedService] = useState("");

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Fetch authenticated user's profile
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

  // Restore login session on application startup
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (active) {
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

        console.error("Session restoration failed:", error);

        // Remove token if backend rejects it
        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          setUser(null);
          setCurrentPage("login");
        } else {
          // Preserve token during network/server errors
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

  // Registration completed
  const handleRegister = () => {
    setCurrentPage("login");
  };

  // Login completed
  const handleLogin = async () => {
    try {
      await loadProfile();
      setCurrentPage("home");
    } catch (error) {
      console.error("Unable to load user profile:", error);
      throw error;
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setCurrentPage("login");
    }
  };

  // Open selected bill payment service
  const handleOpenService = (serviceName) => {
    setSelectedService(serviceName);
    setCurrentPage("servicePayment");
  };

  // Return to Home
  const goHome = () => {
    setCurrentPage("home");
  };

  // Loading screen while restoring session
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

        {/* SPLASH */}
        {currentPage === "splash" && (
            <Splash
                onGetStarted={() => setCurrentPage("register")}
                onLogin={() => setCurrentPage("login")}
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
                onLogin={handleLogin}
                onRegister={() => setCurrentPage("register")}
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

        {/* GLOBAL BOTTOM NAVIGATION */}
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
