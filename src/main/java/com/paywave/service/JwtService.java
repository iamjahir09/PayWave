package com.paywave.service;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

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
}
