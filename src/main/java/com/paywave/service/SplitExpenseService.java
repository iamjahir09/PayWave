package com.paywave.service;

import java.util.stream.Collectors;
import com.paywave.dto.*;
import com.paywave.entity.*;
import com.paywave.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SplitExpenseService {
    private final SplitExpenseRepository expenses;
    private final SplitExpenseShareRepository shares;
    private final UserRepository users;
    private final WalletService walletService;

    public SplitExpenseService(SplitExpenseRepository e, SplitExpenseShareRepository s, UserRepository u,
            WalletService w) {
        expenses = e;
        shares = s;
        users = u;
        walletService = w;
    }

    private Long uid() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional
    public SplitExpenseResponse create(CreateSplitExpenseRequest r) {
        Long id = uid();
        User creator = users.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        Set<String> ids = new LinkedHashSet<>(r.getParticipantPaywaveIds());
        ids.remove(creator.getPaywaveId());
        if (ids.isEmpty())
            throw new IllegalArgumentException("Add at least one participant");
        List<User> people = new ArrayList<>();
        for (String p : ids)
            people.add(users.findByPaywaveId(p).orElseThrow(() -> new RuntimeException("Participant not found: " + p)));
        int n = people.size() + 1;
        BigDecimal each = r.getTotalAmount().divide(BigDecimal.valueOf(n), 2, RoundingMode.DOWN);
        BigDecimal creatorAmount = r.getTotalAmount().subtract(each.multiply(BigDecimal.valueOf(people.size())));
        SplitExpense e = new SplitExpense();
        e.setCreatedBy(creator);
        e.setTitle(r.getTitle().trim());
        e.setTotalAmount(r.getTotalAmount());
        e.setCreatedAt(LocalDateTime.now());
        for (User u : people) {
            SplitExpenseShare s = new SplitExpenseShare();
            s.setExpense(e);
            s.setUser(u);
            s.setShareAmount(each);
            s.setStatus("PENDING");
            e.getShares().add(s);
        }
        SplitExpenseShare own = new SplitExpenseShare();
        own.setExpense(e);
        own.setUser(creator);
        own.setShareAmount(creatorAmount);
        own.setStatus("PAID");
        e.getShares().add(own);
        return map(expenses.save(e));
    }

    public List<SplitExpenseResponse> mine() {
        Long id = uid();
        return expenses.findDistinctByCreatedByIdOrSharesUserIdOrderByCreatedAtDesc(id, id).stream().map(this::map)
                .collect(Collectors.toList());
    }

    @Transactional
    public String settle(Long shareId) {
        Long id = uid();
        SplitExpenseShare s = shares.findByIdAndUserId(shareId, id)
                .orElseThrow(() -> new RuntimeException("Share not found"));
        if (!"PENDING".equals(s.getStatus()))
            throw new IllegalStateException("Share already settled");
        walletService.transferMoney(id, s.getExpense().getCreatedBy().getId(), s.getShareAmount());
        s.setStatus("PAID");
        s.setSettledAt(LocalDateTime.now());
        shares.save(s);
        return "Expense share settled successfully";
    }

    private SplitExpenseResponse map(SplitExpense e) {
        List<SplitExpenseResponse.Share> list = e.getShares().stream()
                .map(s -> new SplitExpenseResponse.Share(s.getId(), s.getUser().getPaywaveId(), s.getShareAmount(),
                        s.getStatus()))
                .collect(Collectors.toList());
        return new SplitExpenseResponse(e.getId(), e.getTitle(), e.getTotalAmount(), e.getCreatedBy().getPaywaveId(),
                e.getCreatedAt(), list);
    }
}
