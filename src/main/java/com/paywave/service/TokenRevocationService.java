
package com.paywave.service;

import com.paywave.entity.RevokedToken;
import com.paywave.repository.RevokedTokenRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class TokenRevocationService {

    private final RevokedTokenRepository revokedTokenRepository;
    private final JwtService jwtService;

    public TokenRevocationService(
            RevokedTokenRepository revokedTokenRepository,
            JwtService jwtService) {

        this.revokedTokenRepository = revokedTokenRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public void revokeToken(String token) {

        // Generate token hash
        String tokenHash = jwtService.hashToken(token);

        // Check whether token is already revoked
        if (revokedTokenRepository.existsByTokenHash(tokenHash)) {
            return;
        }

        // Extract original token expiration
        Instant expiration = jwtService.extractExpiration(token);

        // Create revoked token record
        RevokedToken revokedToken =
                new RevokedToken(tokenHash, expiration);

        // Save in database
        revokedTokenRepository.save(revokedToken);
    }

    @Transactional(readOnly = true)
    public boolean isTokenRevoked(String token) {

        String tokenHash = jwtService.hashToken(token);

        return revokedTokenRepository.existsByTokenHash(tokenHash);
    }
}
