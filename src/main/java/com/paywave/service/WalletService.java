package com.paywave.service;

import com.paywave.dto.SendMoneyRequest;
import com.paywave.dto.WalletResponse;
import com.paywave.entity.*;
import com.paywave.repository.TransactionRepository;
import com.paywave.repository.UserRepository;
import com.paywave.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.security.autoconfigure.SecurityProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository, UserRepository userRepository){
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public WalletResponse getMyWallet(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (long) authentication.getPrincipal();

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(()->new RuntimeException("Wallet not found"));

        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getCurrency()
        );
    }

    @Transactional
    public void transferMoney(Long senderId, Long receiverId, BigDecimal amount){
        Wallet senderWallet = walletRepository.findByUserIdForUpdate(senderId)
                .orElseThrow(() ->new RuntimeException("Sender wallet Not found"));
        Wallet receiverWallet = walletRepository.findByUserIdForUpdate(receiverId)
                .orElseThrow(()-> new RuntimeException("Receiver wallet not found"));

        if(senderId.equals(receiverId)){
            throw new IllegalArgumentException("Cannot send money to yourself");
        }

        if(amount == null || amount.scale()>2 || amount.precision()>19 || amount.compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Invalid transfer amount");
        }

        if(senderWallet.getBalance().compareTo(amount) < 0){
            throw new IllegalArgumentException("Insufficient wallet balance");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(UUID.randomUUID().toString());
        transaction.setSender(senderWallet.getUser());
        transaction.setReceiver(receiverWallet.getUser());
        transaction.setAmount(amount);
        transaction.setCurrency(senderWallet.getCurrency());
        transaction.setTransactionType(TransactionType.SEND);
        transaction.setTransactionStatus(TransactionStatus.SUCCESS);
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    @Transactional
    public WalletResponse addMoney(BigDecimal amount){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        if(amount == null || amount.scale() >2 || amount.precision()>19 || amount.compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Invalid amount");
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(()-> new RuntimeException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(UUID.randomUUID().toString());
        transaction.setSender(null);
        transaction.setReceiver(wallet.getUser());
        transaction.setAmount(amount);
        transaction.setCurrency(wallet.getCurrency());
        transaction.setTransactionType(TransactionType.ADD_MONEY);
        transaction.setTransactionStatus(TransactionStatus.SUCCESS);
        transaction.setCreatedAt(LocalDateTime.now());

        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getCurrency()
        );

    }
}
