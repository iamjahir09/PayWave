package com.paywave.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class SendMoneyRequest {

    @NotBlank(message = "Receiver PayWave ID is required")
    private String receiverPaywaveId;

    @NotBlank(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String description;

    public String getReceiverPaywaveId() {
        return receiverPaywaveId;
    }

    public void setReceiverPaywaveId(String receiverPaywaveId) {
        this.receiverPaywaveId = receiverPaywaveId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
