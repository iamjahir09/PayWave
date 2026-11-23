
package com.paywave.controller;

import com.paywave.dto.CreateSplitExpenseRequest;
import com.paywave.dto.SplitExpenseResponse;
import com.paywave.service.SplitExpenseService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/split-expenses")
public class SplitExpenseController {

    private final SplitExpenseService splitExpenseService;

    public SplitExpenseController(SplitExpenseService splitExpenseService) {
        this.splitExpenseService = splitExpenseService;
    }

    @PostMapping
    public ResponseEntity<SplitExpenseResponse> createSplitExpense(
            @Valid @RequestBody CreateSplitExpenseRequest request) {

        SplitExpenseResponse response = splitExpenseService.create(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SplitExpenseResponse>> getMySplitExpenses() {

        List<SplitExpenseResponse> expenses = splitExpenseService.mine();

        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/shares/{shareId}/settle")
    public ResponseEntity<String> settleShare(
            @PathVariable("shareId") Long shareId) {

        String response = splitExpenseService.settle(shareId);

        return ResponseEntity.ok(response);
    }
}
