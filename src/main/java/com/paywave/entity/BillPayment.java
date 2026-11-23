package com.paywave.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bill_payments")
public class BillPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillType billType;
    @Column(nullable = false)
    private String provider;
    @Column(nullable = false)
    private String customerReference;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    @Column(nullable = false)
    private String status;
    @Column(nullable = false, unique = true)
    private String reference;
    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User v) {
        user = v;
    }

    public BillType getBillType() {
        return billType;
    }

    public void setBillType(BillType v) {
        billType = v;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String v) {
        provider = v;
    }

    public String getCustomerReference() {
        return customerReference;
    }

    public void setCustomerReference(String v) {
        customerReference = v;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal v) {
        amount = v;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String v) {
        status = v;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String v) {
        reference = v;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime v) {
        createdAt = v;
    }
}
