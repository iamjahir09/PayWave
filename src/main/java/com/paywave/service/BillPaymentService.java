package com.paywave.service;

import java.util.stream.Collectors;
import com.paywave.dto.*;
import com.paywave.entity.*;
import com.paywave.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.math.BigDecimal;

@Service
public class BillPaymentService {
    private final BillPaymentRepository bills;
    private final WalletRepository wallets;
    private final UserRepository users;

    public BillPaymentService(BillPaymentRepository b, WalletRepository w, UserRepository u) {
        bills = b;
        wallets = w;
        users = u;
    }

    @Transactional
    public BillPaymentResponse pay(BillPaymentRequest r) {
        Long uid = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (r.getAmount() == null || r.getAmount().scale() > 2 || r.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Invalid amount");
        Wallet wallet = wallets.findByUserIdForUpdate(uid).orElseThrow(() -> new RuntimeException("Wallet not found"));
        if (wallet.getBalance().compareTo(r.getAmount()) < 0)
            throw new IllegalArgumentException("Insufficient wallet balance");
        User user = users.findById(uid).orElseThrow(() -> new RuntimeException("User not found"));
        wallet.setBalance(wallet.getBalance().subtract(r.getAmount()));
        wallets.save(wallet);
        BillPayment p = new BillPayment();
        p.setUser(user);
        p.setBillType(r.getBillType());
        p.setProvider(r.getProvider().trim());
        p.setCustomerReference(r.getCustomerReference().trim());
        p.setAmount(r.getAmount());
        p.setStatus("SUCCESS");
        p.setReference(UUID.randomUUID().toString());
        p.setCreatedAt(LocalDateTime.now());
        return map(bills.save(p));
    }

    public List<BillPaymentResponse> history() {
        Long uid = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return bills.findByUserIdOrderByCreatedAtDesc(uid).stream().map(this::map).collect(Collectors.toList());
    }

    private BillPaymentResponse map(BillPayment p) {
        return new BillPaymentResponse(p.getId(), p.getBillType().name(), p.getProvider(), p.getCustomerReference(),
                p.getAmount(), p.getStatus(), p.getReference(), p.getCreatedAt());
    }
}
