
package com.paywave.service;

import com.paywave.dto.SendMoneyRequest;
import com.paywave.dto.TransactionResponse;
import com.paywave.entity.Transaction;
import com.paywave.entity.TransactionType;
import com.paywave.entity.User;
import com.paywave.repository.TransactionRepository;
import com.paywave.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            WalletService walletService,
            PasswordEncoder passwordEncoder) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<TransactionResponse> getMyTransaction() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof Long)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        Long userId = (Long) authentication.getPrincipal();

        List<Transaction> transactions =
                transactionRepository
                        .findBySenderIdOrReceiverIdOrderByCreatedAtDesc(
                                userId,
                                userId
                        );

        return transactions.stream()
                .map(transaction -> new TransactionResponse(
                        transaction.getTransactionReference(),

                        transaction.getSender() != null
                                ? transaction.getSender().getName()
                                : null,

                        transaction.getReceiver() != null
                                ? transaction.getReceiver().getName()
                                : null,

                        transaction.getAmount(),
                        transaction.getCurrency(),

                        transaction.getTransactionType() == TransactionType.ADD_MONEY
                                ? TransactionType.ADD_MONEY.name()
                                : transaction.getSender() != null
                                && transaction.getSender().getId().equals(userId)
                                ? TransactionType.SEND.name()
                                : TransactionType.RECEIVE.name(),

                        transaction.getTransactionStatus().name(),
                        transaction.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void sendMoney(SendMoneyRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof Long)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        Long senderId = (Long) authentication.getPrincipal();

        if (request == null
                || request.getReceiverPaywaveId() == null
                || request.getReceiverPaywaveId().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Receiver PayWave ID is required"
            );
        }

        // Fetch authenticated sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Sender not found"
                        )
                );

        // Verify actual MPIN
        if (request.getMpin() == null
                || !passwordEncoder.matches(
                request.getMpin(),
                sender.getMpin_hash()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Incorrect MPIN"
            );
        }

        // Find receiver
        User receiver = userRepository
                .findByPaywaveId(request.getReceiverPaywaveId().trim())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Receiver not found"
                        )
                );

        // Prevent sending money to yourself
        if (senderId.equals(receiver.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot send money to yourself"
            );
        }

        // Transfer money through existing wallet service
        walletService.transferMoney(
                senderId,
                receiver.getId(),
                request.getAmount()
        );
    }
}
