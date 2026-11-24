package com.paywave.dto;

public class SendOtpResponse {

    private String message;
    private String demoOtp;
    private long expiresInSeconds;

    public SendOtpResponse(
            String message,
            String demoOtp,
            long expiresInSeconds
    ) {
        this.message = message;
        this.demoOtp = demoOtp;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getMessage() {
        return message;
    }

    public String getDemoOtp() {
        return demoOtp;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }
}