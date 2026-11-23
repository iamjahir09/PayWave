package com.paywave.service;

import java.util.stream.Collectors;
import com.paywave.dto.*;
import com.paywave.entity.*;
import com.paywave.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentReminderService {
    private final PaymentReminderRepository reminders;
    private final UserRepository users;

    public PaymentReminderService(PaymentReminderRepository r, UserRepository u) {
        reminders = r;
        users = u;
    }

    private Long uid() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional
    public PaymentReminderResponse create(PaymentReminderRequest r) {
        User u = users.findById(uid()).orElseThrow(() -> new RuntimeException("User not found"));
        PaymentReminder p = new PaymentReminder();
        p.setUser(u);
        p.setTitle(r.getTitle().trim());
        p.setPayee(r.getPayee());
        p.setAmount(r.getAmount());
        p.setDueDate(r.getDueDate());
        p.setStatus("PENDING");
        p.setCreatedAt(LocalDateTime.now());
        return map(reminders.save(p));
    }

    public List<PaymentReminderResponse> mine() {
        return reminders.findByUserIdOrderByDueDateAsc(uid()).stream().map(this::map).collect(Collectors.toList());
    }

    @Transactional
    public PaymentReminderResponse update(Long id, PaymentReminderRequest r) {
        PaymentReminder p = find(id);
        p.setTitle(r.getTitle().trim());
        p.setPayee(r.getPayee());
        p.setAmount(r.getAmount());
        p.setDueDate(r.getDueDate());
        return map(reminders.save(p));
    }

    @Transactional
    public String paid(Long id) {
        PaymentReminder p = find(id);
        p.setStatus("PAID");
        reminders.save(p);
        return "Reminder marked as paid";
    }

    @Transactional
    public String delete(Long id) {
        reminders.delete(find(id));
        return "Reminder deleted successfully";
    }

    private PaymentReminder find(Long id) {
        return reminders.findByIdAndUserId(id, uid()).orElseThrow(() -> new RuntimeException("Reminder not found"));
    }

    private PaymentReminderResponse map(PaymentReminder p) {
        return new PaymentReminderResponse(p.getId(), p.getTitle(), p.getPayee(), p.getAmount(), p.getDueDate(),
                p.getStatus(), p.getCreatedAt());
    }
}
