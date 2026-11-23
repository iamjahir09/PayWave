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
public class MoneyRequestService {
    private final MoneyRequestRepository requests;
    private final UserRepository users;
    private final WalletService wallets;

    public MoneyRequestService(MoneyRequestRepository r, UserRepository u, WalletService w) {
        requests = r;
        users = u;
        wallets = w;
    }

    private Long uid() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional
    public MoneyRequestResponse create(CreateMoneyRequest r) {
        Long id = uid();
        User requester = users.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        User payer = users.findByPaywaveId(r.getPayerPaywaveId())
                .orElseThrow(() -> new RuntimeException("PayWave user not found"));
        if (id.equals(payer.getId()))
            throw new IllegalArgumentException("Cannot request money from yourself");
        if (r.getAmount().scale() > 2 || r.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Invalid amount");
        MoneyRequest m = new MoneyRequest();
        m.setRequester(requester);
        m.setPayer(payer);
        m.setAmount(r.getAmount());
        m.setNote(r.getNote());
        m.setStatus("PENDING");
        m.setReference(UUID.randomUUID().toString());
        m.setCreatedAt(LocalDateTime.now());
        return map(requests.save(m));
    }

    public List<MoneyRequestResponse> mine() {
        Long id = uid();
        return requests.findByRequesterIdOrPayerIdOrderByCreatedAtDesc(id, id).stream().map(this::map)
                .collect(Collectors.toList());
    }

    @Transactional
    public MoneyRequestResponse respond(Long id, boolean accept) {
        Long payerId = uid();
        MoneyRequest m = requests.findByIdAndPayerId(id, payerId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (!"PENDING".equals(m.getStatus()))
            throw new IllegalStateException("Request already processed");
        if (accept) {
            wallets.transferMoney(payerId, m.getRequester().getId(), m.getAmount());
            m.setStatus("PAID");
        } else
            m.setStatus("REJECTED");
        return map(requests.save(m));
    }

    private MoneyRequestResponse map(MoneyRequest m) {
        return new MoneyRequestResponse(m.getId(), m.getRequester().getPaywaveId(), m.getPayer().getPaywaveId(),
                m.getAmount(), m.getNote(), m.getStatus(), m.getReference(), m.getCreatedAt());
    }
}
