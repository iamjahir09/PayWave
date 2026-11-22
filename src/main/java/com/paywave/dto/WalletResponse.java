package com.paywave.dto;

import java.math.BigDecimal;

public class WalletResponse {
    private Long walletId;
    private BigDecimal balance;
    private String currency;

    public WalletResponse(){

    }

    public WalletResponse(Long walletId, BigDecimal balance, String currency){
        this.walletId = walletId;
        this.balance = balance;
        this.currency = currency;
    }

    public Long getWalletId() {
        return walletId;
    }

    public void setWalletId(Long walletId) {
        this.walletId = walletId;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
