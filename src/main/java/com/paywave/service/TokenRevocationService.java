
package com.paywave.service;

import com.paywave.entity.RevokedToken;
import com.paywave.repository.RevokedTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // 1. Generate token hash
        String tokenHash = jwtService.hashToken(token);

        // 2. Check whether token is already revoked
        if (revokedTokenRepository.existsByTokenHash(tokenHash)) {
            return;
        }

        // 3. Extract original token expiration
        var expiration = jwtService.extractExpiration(token);

        // 4. Create revoked token record
        RevokedToken revokedToken =
                new RevokedToken(tokenHash, expiration);

        // 5. Save in database
        revokedTokenRepository.save(revokedToken);
    }

    public boolean isTokenRevoked(String token) {

        String tokenHash = jwtService.hashToken(token);

        return revokedTokenRepository.existsByTokenHash(tokenHash);
    }
}
