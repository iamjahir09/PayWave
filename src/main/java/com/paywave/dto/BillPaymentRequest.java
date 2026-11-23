package com.paywave.dto;

import com.paywave.entity.BillType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class BillPaymentRequest {
    @NotNull
    private BillType billType;
    @NotBlank
    private String provider;
    @NotBlank
    private String customerReference;
    @NotNull
    @DecimalMin("1.00")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal amount;

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
}
