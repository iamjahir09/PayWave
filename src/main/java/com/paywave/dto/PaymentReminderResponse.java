package com.paywave.dto;

import java.math.BigDecimal;
import java.time.*;

public class PaymentReminderResponse {
    private Long id;
    private String title, payee, status;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    public PaymentReminderResponse(Long id, String title, String payee, BigDecimal amount, LocalDate due, String status,
            LocalDateTime created) {
        this.id = id;
        this.title = title;
        this.payee = payee;
        this.amount = amount;
        dueDate = due;
        this.status = status;
        createdAt = created;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPayee() {
        return payee;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
