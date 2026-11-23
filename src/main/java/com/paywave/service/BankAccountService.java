
package com.paywave.service;

import com.paywave.dto.BankAccountOtpResponse;
import com.paywave.dto.BankAccountResponse;
import com.paywave.dto.LinkBankAccountRequest;
import com.paywave.entity.BankAccount;
import com.paywave.entity.User;
import com.paywave.repository.BankAccountRepository;
import com.paywave.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.paywave.dto.VerifyBankAccountOtpRequest;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public BankAccountService(
            BankAccountRepository bankAccountRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.bankAccountRepository = bankAccountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    private void saveOtp(BankAccount bankAccount, String otp) {

        bankAccount.setOtpHash(passwordEncoder.encode(otp));
        bankAccount.setOtpExpiresAt(LocalDateTime.now().plusMinutes(5));
        bankAccount.setOtpAttempts(0);

        bankAccountRepository.save(bankAccount);
    }

    @Transactional
    public BankAccountOtpResponse linkBankAccount(
            LinkBankAccountRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (bankAccountRepository.existsByAccountNumber(
                request.getAccountNumber())) {

            throw new RuntimeException(
                    "Bank account is already linked");
        }

        BankAccount bankAccount = new BankAccount();

        bankAccount.setUser(user);
        bankAccount.setBankName(request.getBankName());
        bankAccount.setAccountNumber(request.getAccountNumber());
        bankAccount.setIfscCode(request.getIfscCode());
        bankAccount.setAccountHolderName(
                request.getAccountHolderName());

        bankAccount.setPrimary(false);
        bankAccount.setVerified(false);

        bankAccountRepository.save(bankAccount);

        String otp = generateOtp();

        saveOtp(bankAccount, otp);

        return new BankAccountOtpResponse(
                bankAccount.getId(),
                "OTP generated successfully",
                otp
        );
    }


    @Transactional
    public String verifyBankAccountOtp(
            VerifyBankAccountOtpRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        BankAccount bankAccount =
                bankAccountRepository.findByIdAndUserId(
                        request.getBankAccountId(), userId
                ).orElseThrow(() ->
                        new RuntimeException("Bank account not found"));

        if (bankAccount.isVerified()) {
            return "Bank account is already verified";
        }

        if (bankAccount.getOtpAttempts() >= 3) {
            return "Maximum OTP attempts exceeded";
        }

        if (bankAccount.getOtpExpiresAt() == null ||
                LocalDateTime.now().isAfter(
                        bankAccount.getOtpExpiresAt())) {

            return "OTP has expired. Please generate a new OTP";
        }

        if (!passwordEncoder.matches(
                request.getOtp(), bankAccount.getOtpHash())) {

            bankAccount.setOtpAttempts(
                    bankAccount.getOtpAttempts() + 1);

            bankAccountRepository.save(bankAccount);

            return "Invalid OTP. Attempts used: "
                    + bankAccount.getOtpAttempts() + "/3";
        }

        bankAccount.setVerified(true);

        bankAccount.setOtpHash(null);
        bankAccount.setOtpExpiresAt(null);
        bankAccount.setOtpAttempts(0);

        if (!bankAccountRepository
                .existsByUserIdAndPrimaryTrue(userId)) {

            bankAccount.setPrimary(true);
        }

        bankAccountRepository.save(bankAccount);

        return "Bank account verified successfully";
    }


    public List<BankAccountResponse> getMyBankAccounts() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        List<BankAccount> accounts =
                bankAccountRepository.findByUserId(userId);

        return accounts.stream()
                .map(account -> new BankAccountResponse(
                        account.getId(),
                        account.getBankName(),
                        "XXXXXX" + account.getAccountNumber()
                                .substring(account.getAccountNumber().length() - 4),
                        account.getIfscCode(),
                        account.getAccountHolderName(),
                        account.isPrimary(),
                        account.isVerified()
                ))
                .collect(Collectors.toList());
    }


    @Transactional
    public String setPrimaryBankAccount(Long bankAccountId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        BankAccount selectedAccount =
                bankAccountRepository.findByIdAndUserId(
                        bankAccountId, userId
                ).orElseThrow(() ->
                        new RuntimeException("Bank account not found"));

        if (!selectedAccount.isVerified()) {
            throw new RuntimeException(
                    "Only verified bank accounts can be primary");
        }

        List<BankAccount> accounts =
                bankAccountRepository.findByUserId(userId);

        // Remove primary status from existing accounts
        for (BankAccount account : accounts) {
            account.setPrimary(false);
        }

        // Set selected account as primary
        selectedAccount.setPrimary(true);

        bankAccountRepository.saveAll(accounts);

        return "Primary bank account updated successfully";
    }


    @Transactional
    public String deleteBankAccount(Long bankAccountId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        BankAccount account =
                bankAccountRepository.findByIdAndUserId(
                        bankAccountId, userId
                ).orElseThrow(() ->
                        new RuntimeException("Bank account not found"));

        boolean wasPrimary = account.isPrimary();

        bankAccountRepository.delete(account);

        if (wasPrimary) {

            List<BankAccount> remainingAccounts =
                    bankAccountRepository.findByUserId(userId);

            remainingAccounts.stream()
                    .filter(BankAccount::isVerified)
                    .findFirst()
                    .ifPresent(nextPrimary -> {
                        nextPrimary.setPrimary(true);
                        bankAccountRepository.save(nextPrimary);
                    });
        }

        return "Bank account deleted successfully";
    }

}
