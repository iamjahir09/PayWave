
package com.paywave.controller;

import com.paywave.dto.CreateMoneyRequest;
import com.paywave.dto.MoneyRequestResponse;
import com.paywave.service.MoneyRequestService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/money-requests")
public class MoneyRequestController {

    private final MoneyRequestService moneyRequestService;

    public MoneyRequestController(MoneyRequestService moneyRequestService) {
        this.moneyRequestService = moneyRequestService;
    }

    @PostMapping
    public ResponseEntity<MoneyRequestResponse> createMoneyRequest(
            @Valid @RequestBody CreateMoneyRequest request) {

        MoneyRequestResponse response = moneyRequestService.create(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<MoneyRequestResponse>> getMyRequests() {

        List<MoneyRequestResponse> requests = moneyRequestService.mine();

        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<MoneyRequestResponse> acceptMoneyRequest(
            @PathVariable("id") Long id) {

        MoneyRequestResponse response = moneyRequestService.respond(id, true);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<MoneyRequestResponse> rejectMoneyRequest(
            @PathVariable("id") Long id) {

        MoneyRequestResponse response = moneyRequestService.respond(id, false);

        return ResponseEntity.ok(response);
    }
}
