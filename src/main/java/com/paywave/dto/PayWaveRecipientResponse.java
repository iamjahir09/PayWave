package com.paywave.dto;

public class PayWaveRecipientResponse {

    private String name;
    private String paywaveId;

    public PayWaveRecipientResponse() {
    }

    public PayWaveRecipientResponse(String name, String paywaveId) {
        this.name = name;
        this.paywaveId = paywaveId;
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
}