package com.paywave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {
    @NotBlank(message = "Mobile Number Required")
    @Pattern(regexp = "^[6-9]\\d{9}$",message = "Enter a valid 10-digit Indian mobile number")
    private String mobileNumber;

    @NotBlank(message = "Mpin Required")
    @Pattern(regexp = "^\\d{6}$",message = "MPIN must contain exactly 6 digits")
    private String mpin;

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getMpin() {
        return mpin;
    }

    public void setMpin(String mpin) {
        this.mpin = mpin;
    }
}
