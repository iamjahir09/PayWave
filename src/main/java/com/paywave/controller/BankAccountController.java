
package com.paywave.controller;

import com.paywave.dto.BankAccountOtpResponse;
import com.paywave.dto.BankAccountResponse;
import com.paywave.dto.LinkBankAccountRequest;
import com.paywave.dto.VerifyBankAccountOtpRequest;
import com.paywave.service.BankAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(
            BankAccountService bankAccountService) {

        this.bankAccountService = bankAccountService;
    }

    // Link a new bank account and generate OTP
    @PostMapping("/link")
    public ResponseEntity<BankAccountOtpResponse> linkBankAccount(
            @Valid @RequestBody LinkBankAccountRequest request) {

        BankAccountOtpResponse response =
                bankAccountService.linkBankAccount(request);

        return ResponseEntity.ok(response);
    }

    // Verify bank account using OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyBankAccountOtp(
            @Valid @RequestBody VerifyBankAccountOtpRequest request) {

        String response =
                bankAccountService.verifyBankAccountOtp(request);

        return ResponseEntity.ok(response);
    }

    // Get all linked bank accounts of logged-in user
    @GetMapping("/my-accounts")
    public ResponseEntity<List<BankAccountResponse>> getMyBankAccounts() {

        List<BankAccountResponse> accounts =
                bankAccountService.getMyBankAccounts();

        return ResponseEntity.ok(accounts);
    }


    @PutMapping("/{bankAccountId}/primary")
    public ResponseEntity<String> setPrimaryBankAccount(
            @PathVariable Long bankAccountId) {

        String response =
                bankAccountService.setPrimaryBankAccount(bankAccountId);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{bankAccountId}")
    public ResponseEntity<String> deleteBankAccount(
            @PathVariable Long bankAccountId) {

        String response =
                bankAccountService.deleteBankAccount(bankAccountId);

        return ResponseEntity.ok(response);
    }

}
