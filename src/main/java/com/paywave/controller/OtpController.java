
package com.paywave.controller;

import com.paywave.dto.SendOtpRequest;
import com.paywave.dto.SendOtpResponse;
import com.paywave.dto.VerifyOtpRequest;
import com.paywave.dto.VerifyOtpResponse;
import com.paywave.entity.User;
import com.paywave.repository.UserRepository;
import com.paywave.service.OtpService;
import com.paywave.service.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class OtpController {

    private final OtpService otpService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OtpController(
            OtpService otpService,
            UserRepository userRepository,
            JwtService jwtService) {

        this.otpService = otpService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // =====================================
    // SEND DEMO OTP
    // =====================================

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        String mobileNumber = request.getMobileNumber();

        User user = userRepository
                .findByMobileNumber(mobileNumber)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No account found with this mobile number.");
        }

        String demoOtp = otpService.generateOtp(mobileNumber);

        SendOtpResponse response = new SendOtpResponse(
                "Demo OTP generated successfully.",
                demoOtp,
                120
        );

        return ResponseEntity.ok(response);
    }

    // =====================================
    // VERIFY DEMO OTP
    // =====================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        String mobileNumber = request.getMobileNumber();
        String enteredOtp = request.getOtp();

        try {

            boolean verified = otpService.verifyOtp(
                    mobileNumber,
                    enteredOtp
            );

            if (!verified) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP.");
            }

            User user = userRepository
                    .findByMobileNumber(mobileNumber)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("User account not found.");
            }

            String token = jwtService.generateToken(user.getId());

            VerifyOtpResponse response = new VerifyOtpResponse(
                    token,
                    "OTP verified successfully. Login successful."
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error.getMessage());
        }
    }
}
