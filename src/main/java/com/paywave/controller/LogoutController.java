
package com.paywave.controller;

import com.paywave.service.TokenRevocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    private final TokenRevocationService tokenRevocationService;

    public LogoutController(TokenRevocationService tokenRevocationService) {
        this.tokenRevocationService = tokenRevocationService;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(value = "Authorization", required = false)
            String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Valid Bearer token is required");
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Valid Bearer token is required");
        }

        tokenRevocationService.revokeToken(token);

        return ResponseEntity.ok("Logged out successfully");
    }
}
