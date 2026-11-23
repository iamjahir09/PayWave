
package com.paywave.dto;

import com.paywave.entity.BillType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class BillPaymentRequest {

    @NotNull(message = "Bill type is required")
    private BillType billType;

    @NotBlank(message = "Provider is required")
    private String provider;

    @NotBlank(message = "Customer reference is required")
    private String customerReference;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least 1")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal amount;

    @NotBlank(message = "MPIN is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "MPIN must be exactly 6 digits")
    private String mpin;

    public BillType getBillType() {
        return billType;
    }

    public void setBillType(BillType billType) {
        this.billType = billType;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getCustomerReference() {
        return customerReference;
    }

    public void setCustomerReference(String customerReference) {
        this.customerReference = customerReference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getMpin() {
        return mpin;
    }

    public void setMpin(String mpin) {
        this.mpin = mpin;
    }
}
