package com.paywave.service;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class JwtService {
    public final SecretKey secretKey;

    public JwtService(SecretKey secretKey){
        this.secretKey = secretKey;
    }

    public String generateToken(Long userId){
        long currentTime = System.currentTimeMillis();
        long expirationTime = currentTime + (1000*60*60);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date(currentTime))
                .expiration(new Date(expirationTime))
                .signWith(secretKey).compact();
    }

    public Long extractUserId(String token){
        String subject = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

        return Long.parseLong(subject);
    }


    public String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hashedBytes);

        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 algorithm not available", ex);
        }
    }

    public Instant extractExpiration(String token) {

        Date expiration = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return expiration.toInstant();
    }

}
