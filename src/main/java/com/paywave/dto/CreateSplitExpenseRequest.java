package com.paywave.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class CreateSplitExpenseRequest {
    @NotBlank
    @Size(max = 150)
    private String title;
    @NotNull
    @DecimalMin("0.01")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal totalAmount;
    @NotEmpty
    private List<@NotBlank String> participantPaywaveIds;

    public String getTitle() {
        return title;
    }

    public void setTitle(String v) {
        title = v;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal v) {
        totalAmount = v;
    }

    public List<String> getParticipantPaywaveIds() {
        return participantPaywaveIds;
    }

    public void setParticipantPaywaveIds(List<String> v) {
        participantPaywaveIds = v;
    }
}
