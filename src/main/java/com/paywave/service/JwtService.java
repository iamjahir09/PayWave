
package com.paywave.service;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(SecretKey secretKey) {
        this.secretKey = secretKey;
    }

    public String generateToken(Long userId) {

        long currentTime = System.currentTimeMillis();
        long expirationTime = currentTime + (1000L * 60 * 60);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date(currentTime))
                .expiration(new Date(expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public Long extractUserId(String token) {

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

            return toHex(hashedBytes);

        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available", ex
            );
        }
    }

    private String toHex(byte[] bytes) {

        StringBuilder hexString = new StringBuilder(bytes.length * 2);

        for (byte b : bytes) {
            hexString.append(
                    String.format("%02x", b & 0xff)
            );
        }

        return hexString.toString();
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
