package com.paywave.dto;

import java.math.BigDecimal;

public class BankBalanceResponse {

    private Long bankAccountId;
    private String bankName;
    private String maskedAccountNumber;
    private BigDecimal balance;
    private String currency;
    private String message;

    public BankBalanceResponse(
            Long bankAccountId,
            String bankName,
            String maskedAccountNumber,
            BigDecimal balance,
            String currency,
            String message) {

        this.bankAccountId = bankAccountId;
        this.bankName = bankName;
        this.maskedAccountNumber = maskedAccountNumber;
        this.balance = balance;
        this.currency = currency;
        this.message = message;
    }

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public String getBankName() {
        return bankName;
    }

    public String getMaskedAccountNumber() {
        return maskedAccountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getCurrency() {
        return currency;
    }

    public String getMessage() {
        return message;
    }
}