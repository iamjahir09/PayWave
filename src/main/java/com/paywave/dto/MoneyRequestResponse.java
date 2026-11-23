package com.paywave.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MoneyRequestResponse {
    private Long id;
    private String requesterPaywaveId, payerPaywaveId, note, status, reference;
    private BigDecimal amount;
    private LocalDateTime createdAt;

    public MoneyRequestResponse(Long id, String a, String b, BigDecimal amount, String note, String status, String ref,
            LocalDateTime at) {
        this.id = id;
        requesterPaywaveId = a;
        payerPaywaveId = b;
        this.amount = amount;
        this.note = note;
        this.status = status;
        reference = ref;
        createdAt = at;
    }

    public Long getId() {
        return id;
    }

    public String getRequesterPaywaveId() {
        return requesterPaywaveId;
    }

    public String getPayerPaywaveId() {
        return payerPaywaveId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getNote() {
        return note;
    }

    public String getStatus() {
        return status;
    }

    public String getReference() {
        return reference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
