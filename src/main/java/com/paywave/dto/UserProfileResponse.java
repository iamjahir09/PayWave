package com.paywave.dto;

public class UserProfileResponse {
    private Long userId;
    private String name;
    private String mobileNumber;
    private String email;

    public UserProfileResponse(){

    }

    public UserProfileResponse(Long userId, String name, String mobileNumber, String email){
        this.userId = userId;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.email = email;
    }

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

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
