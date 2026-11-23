
package com.paywave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class VerifyBankAccountOtpRequest {

    @NotNull(message = "Bank account ID is required")
    private Long bankAccountId;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$",
            message = "OTP must be exactly 6 digits")
    private String otp;

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public void setBankAccountId(Long bankAccountId) {
        this.bankAccountId = bankAccountId;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
