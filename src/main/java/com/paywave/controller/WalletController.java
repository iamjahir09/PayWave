package com.paywave.controller;

import com.paywave.dto.AddMoneyRequest;
import com.paywave.dto.WalletResponse;
import com.paywave.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    private final WalletService walletService;
    public WalletController(WalletService walletService){
        this.walletService = walletService;
    }

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(){
        WalletResponse response = walletService.getMyWallet();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-money")
    public ResponseEntity<WalletResponse> addMoney(@Valid @RequestBody AddMoneyRequest request){
        WalletResponse response = walletService.addMoney(request.getAmount());
        return ResponseEntity.ok(response);
    }
}
