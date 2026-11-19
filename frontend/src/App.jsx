
import { useState } from "react";

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

import "./static/css/App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("splash");
  const [selectedService, setSelectedService] = useState("");

  const [user, setUser] = useState({
    name: "",
    mobileNumber: "",
    email: "",
  });

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage("login");
  };

  const handleLogin = () => {
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setCurrentPage("login");
  };

  const handleOpenService = (serviceName) => {
    setSelectedService(serviceName);
    setCurrentPage("servicePayment");
  };

  const goHome = () => {
    setCurrentPage("home");
  };

  return (
    <div className="app-container">

      {currentPage === "splash" && (
        <Splash
          onGetStarted={() => setCurrentPage("register")}
          onLogin={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "register" && (
        <Register
          onRegister={handleRegister}
          onLogin={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "login" && (
        <Login
          onLogin={handleLogin}
          onRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "home" && (
        <Home
          user={user}
          onOpenBankAccounts={() => setCurrentPage("bankAccounts")}
          onOpenHistory={() => setCurrentPage("history")}
          onOpenWallet={() => setCurrentPage("wallet")}
          onOpenProfile={() => setCurrentPage("profile")}
          onOpenSendMoney={() => setCurrentPage("sendMoney")}
          onOpenReceiveMoney={() => setCurrentPage("receiveMoney")}
          onOpenScanQR={() => setCurrentPage("scanQR")}
          onOpenService={handleOpenService}
          onOpenSplitExpenses={() => setCurrentPage("splitExpenses")}
          onOpenRequestMoney={() => setCurrentPage("requestMoney")}
          onOpenPaymentReminders={() => setCurrentPage("paymentReminders")}
        />
      )}

      {currentPage === "bankAccounts" && (
        <BankAccounts onBack={goHome} />
      )}

      {currentPage === "history" && (
        <History onBack={goHome} />
      )}

      {currentPage === "wallet" && (
        <Wallet onBack={goHome} />
      )}

      {currentPage === "profile" && (
        <Profile
          user={user}
          onBack={goHome}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "sendMoney" && (
        <SendMoney onBack={goHome} />
      )}

      {currentPage === "receiveMoney" && (
        <ReceiveMoney
          user={user}
          onBack={goHome}
        />
      )}

      {currentPage === "scanQR" && (
        <ScanQR onBack={goHome} />
      )}

      {currentPage === "servicePayment" && (
        <ServicePayment
          service={selectedService}
          onBack={goHome}
        />
      )}

      {currentPage === "splitExpenses" && (
        <SplitExpenses onBack={goHome} />
      )}

      {currentPage === "requestMoney" && (
        <RequestMoney onBack={goHome} />
      )}

      {currentPage === "paymentReminders" && (
        <PaymentReminders onBack={goHome} />
      )}

    </div>
  );
}

export default App;
