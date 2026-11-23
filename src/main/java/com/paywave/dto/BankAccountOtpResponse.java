package com.paywave.dto;

public class BankAccountOtpResponse {

    private Long bankAccountId;
    private String message;
    private String demoOtp;

    public BankAccountOtpResponse() {
    }

    public BankAccountOtpResponse(
            Long bankAccountId,
            String message,
            String demoOtp) {
        this.bankAccountId = bankAccountId;
        this.message = message;
        this.demoOtp = demoOtp;
    }

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public void setBankAccountId(Long bankAccountId) {
        this.bankAccountId = bankAccountId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDemoOtp() {
        return demoOtp;
    }

    public void setDemoOtp(String demoOtp) {
        this.demoOtp = demoOtp;
    }
}