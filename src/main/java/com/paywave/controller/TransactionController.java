package com.paywave.controller;

import com.paywave.dto.SendMoneyRequest;
import com.paywave.dto.TransactionResponse;
import com.paywave.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final SendMoneyRequest sendMoneyRequest;
    public TransactionController(TransactionService transactionService, SendMoneyRequest sendMoneyRequest){
        this.transactionService = transactionService;
        this.sendMoneyRequest = sendMoneyRequest;
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(){
        List<TransactionResponse> transactions = transactionService.getMyTransaction();
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMoney(@Valid @RequestBody SendMoneyRequest request){
        transactionService.sendMoney(request);
        return ResponseEntity.ok("Money sent successfully");
    }
}
