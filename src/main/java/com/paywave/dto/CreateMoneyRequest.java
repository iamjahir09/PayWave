package com.paywave.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateMoneyRequest {
    @NotBlank
    private String payerPaywaveId;
    @NotNull
    @DecimalMin("0.01")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal amount;
    @Size(max = 255)
    private String note;

    public String getPayerPaywaveId() {
        return payerPaywaveId;
    }

    public void setPayerPaywaveId(String v) {
        payerPaywaveId = v;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal v) {
        amount = v;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String v) {
        note = v;
    }
}
