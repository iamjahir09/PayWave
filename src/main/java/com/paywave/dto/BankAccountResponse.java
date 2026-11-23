
package com.paywave.dto;

public class BankAccountResponse {

    private Long id;
    private String bankName;
    private String maskedAccountNumber;
    private String ifscCode;
    private String accountHolderName;
    private boolean primary;
    private boolean verified;

    public BankAccountResponse(
            Long id,
            String bankName,
            String maskedAccountNumber,
            String ifscCode,
            String accountHolderName,
            boolean primary,
            boolean verified) {

        this.id = id;
        this.bankName = bankName;
        this.maskedAccountNumber = maskedAccountNumber;
        this.ifscCode = ifscCode;
        this.accountHolderName = accountHolderName;
        this.primary = primary;
        this.verified = verified;
    }

    public Long getId() {
        return id;
    }

    public String getBankName() {
        return bankName;
    }

    public String getMaskedAccountNumber() {
        return maskedAccountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public boolean isPrimary() {
        return primary;
    }

    public boolean isVerified() {
        return verified;
    }
}
