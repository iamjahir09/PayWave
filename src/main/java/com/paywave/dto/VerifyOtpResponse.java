package com.paywave.dto;

public class VerifyOtpResponse {

    private String token;
    private String message;

    public VerifyOtpResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}