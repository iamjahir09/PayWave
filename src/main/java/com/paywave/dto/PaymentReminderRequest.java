package com.paywave.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentReminderRequest {
    @NotBlank
    @Size(max = 120)
    private String title;
    @Size(max = 120)
    private String payee;
    @DecimalMin("0.01")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal amount;
    @NotNull
    @FutureOrPresent
    private LocalDate dueDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String v) {
        title = v;
    }

    public String getPayee() {
        return payee;
    }

    public void setPayee(String v) {
        payee = v;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal v) {
        amount = v;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate v) {
        dueDate = v;
    }
}
