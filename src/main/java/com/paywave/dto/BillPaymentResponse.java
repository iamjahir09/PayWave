package com.paywave.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BillPaymentResponse {
    private Long id;
    private String billType, provider, customerReference, status, reference;
    private BigDecimal amount;
    private LocalDateTime createdAt;

    public BillPaymentResponse(Long id, String type, String provider, String customer, BigDecimal amount, String status,
                               String ref, LocalDateTime at) {
        this.id = id;
        this.billType = type;
        this.provider = provider;
        this.customerReference = customer;
        this.amount = amount;
        this.status = status;
        this.reference = ref;
        this.createdAt = at;
    }

    public Long getId() {
        return id;
    }

    public String getBillType() {
        return billType;
    }

    public String getProvider() {
        return provider;
    }

    public String getCustomerReference() {
        return customerReference;
    }

    public BigDecimal getAmount() {
        return amount;
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
