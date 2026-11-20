package com.paywave.dto;

public class UserQrResponse {
    private String name;
    private String paywaveId;
    private String qrPayload;

    public UserQrResponse(){

    }
    public UserQrResponse(String name, String paywaveId, String qrPayload) {
        this.name = name;
        this.paywaveId = paywaveId;
        this.qrPayload = qrPayload;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPaywaveId() {
        return paywaveId;
    }

    public void setPaywaveId(String paywaveId) {
        this.paywaveId = paywaveId;
    }

    public String getQrPayload() {
        return qrPayload;
    }

    public void setQrPayload(String qrPayload) {
        this.qrPayload = qrPayload;
    }
}
