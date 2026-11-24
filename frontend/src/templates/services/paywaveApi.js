import api from "./apiClient";

// Authentication
export const registerUser = (payload) => api.post("/api/users/register", payload);
export const loginUser = (payload) => api.post("/api/auth/login", payload);
export const logoutUser = () => api.post("/api/auth/logout");

// User and profile
export const getMyProfile = () => api.get("/api/users/me");
export const updateMyProfile = (payload) => api.put("/api/users/me", payload);
export const changeMpin = (payload) => api.post("/api/users/change-mpin", payload);
export const getMyQr = () => api.get("/api/users/my-qr");

// Wallet and transactions
export const getMyWallet = () => api.get("/api/wallet/me");
export const addMoney = (amount) => api.post("/api/wallet/add-money", { amount: Number(amount) });
export const sendMoney = (payload) => api.post("/api/transactions/send", payload);
export const getTransactionHistory = () => api.get("/api/transactions/history");

// Bank accounts
export const linkBankAccount = (payload) => api.post("/api/bank-accounts/link", payload);
export const verifyBankAccountOtp = (payload) => api.post("/api/bank-accounts/verify-otp", payload);
export const getBankAccounts = () => api.get("/api/bank-accounts/my-accounts");
export const setPrimaryBankAccount = (id) => api.put(`/api/bank-accounts/${id}/primary`);
export const deleteBankAccount = (id) => api.delete(`/api/bank-accounts/${id}`);
export const checkBankBalance = (payload) => api.post("/api/bank-accounts/check-balance", payload);

// Bill payments: billType must be MOBILE_RECHARGE, ELECTRICITY, DTH_RECHARGE, or WATER
export const payBill = (payload) => api.post("/api/bill-payments", payload);
export const getBillPaymentHistory = () => api.get("/api/bill-payments/history");

// Request money
export const createMoneyRequest = (payload) => api.post("/api/money-requests", payload);
export const getMyMoneyRequests = () => api.get("/api/money-requests/my-requests");
export const acceptMoneyRequest = (id) => api.put(`/api/money-requests/${id}/accept`);
export const rejectMoneyRequest = (id) => api.put(`/api/money-requests/${id}/reject`);

// Split expenses
export const createSplitExpense = (payload) => api.post("/api/split-expenses", payload);
export const getMySplitExpenses = () => api.get("/api/split-expenses/mine");
export const settleSplitShare = (shareId) => api.post(`/api/split-expenses/shares/${shareId}/settle`);

// Payment reminders
export const createPaymentReminder = (payload) => api.post("/api/payment-reminders", payload);
export const getPaymentReminders = () => api.get("/api/payment-reminders");
export const updatePaymentReminder = (id, payload) => api.put(`/api/payment-reminders/${id}`, payload);
export const markReminderPaid = (id) => api.patch(`/api/payment-reminders/${id}/paid`);
export const deletePaymentReminder = (id) => api.delete(`/api/payment-reminders/${id}`);
export const getPayWaveRecipient = (paywaveId) => api.get("/api/users/lookup", { params: { paywaveId }, });

// Send Demo OTP
export const sendOtp = (mobileNumber) =>api.post("/api/auth/send-otp", { mobileNumber });

// Verify Demo OTP
export const verifyOtp = (mobileNumber, otp) =>api.post("/api/auth/verify-otp", {mobileNumber,otp,});