
package com.paywave.controller;

import com.paywave.dto.PaymentReminderRequest;
import com.paywave.dto.PaymentReminderResponse;
import com.paywave.service.PaymentReminderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-reminders")
public class PaymentReminderController {

    private final PaymentReminderService paymentReminderService;

    public PaymentReminderController(PaymentReminderService paymentReminderService) {
        this.paymentReminderService = paymentReminderService;
    }

    @PostMapping
    public ResponseEntity<PaymentReminderResponse> createReminder(
            @Valid @RequestBody PaymentReminderRequest request) {

        PaymentReminderResponse response = paymentReminderService.create(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PaymentReminderResponse>> getMyReminders() {

        List<PaymentReminderResponse> reminders = paymentReminderService.mine();

        return ResponseEntity.ok(reminders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentReminderResponse> updateReminder(
            @PathVariable("id") Long id,
            @Valid @RequestBody PaymentReminderRequest request) {

        PaymentReminderResponse response = paymentReminderService.update(id, request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<String> markReminderAsPaid(
            @PathVariable("id") Long id) {

        String response = paymentReminderService.paid(id);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReminder(
            @PathVariable("id") Long id) {

        String response = paymentReminderService.delete(id);

        return ResponseEntity.ok(response);
    }
}
