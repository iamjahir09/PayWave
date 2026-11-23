
package com.paywave.controller;

import com.paywave.dto.BillPaymentRequest;
import com.paywave.dto.BillPaymentResponse;
import com.paywave.service.BillPaymentService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bill-payments")
public class BillPaymentController {

    private final BillPaymentService billPaymentService;

    public BillPaymentController(BillPaymentService billPaymentService) {
        this.billPaymentService = billPaymentService;
    }

    @PostMapping
    public ResponseEntity<BillPaymentResponse> payBill(
            @Valid @RequestBody BillPaymentRequest request) {

        BillPaymentResponse response = billPaymentService.pay(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<BillPaymentResponse>> getPaymentHistory() {

        List<BillPaymentResponse> history = billPaymentService.history();

        return ResponseEntity.ok(history);
    }
}
