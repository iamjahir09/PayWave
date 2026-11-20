package com.paywave.dto;

public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String message;
    private String paywaveId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPaywaveId() {
        return paywaveId;
    }

    public void setPaywaveId(String paywaveId) {
        this.paywaveId = paywaveId;
    }
}
