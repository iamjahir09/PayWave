package com.paywave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;

public class CheckBankBalanceRequest {

    @NotNull(message = "Bank account ID is required")
    private Long bankAccountId;

    @NotBlank(message = "MPIN is required")
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "MPIN must be exactly 6 digits"
    )
    private String mpin;

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public void setBankAccountId(Long bankAccountId) {
        this.bankAccountId = bankAccountId;
    }

    public String getMpin() {
        return mpin;
    }

    public void setMpin(String mpin) {
        this.mpin = mpin;
    }
}