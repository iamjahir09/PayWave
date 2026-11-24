
package com.paywave.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final long OTP_EXPIRY_SECONDS = 120;
    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<String, OtpData> otpStore =
            new ConcurrentHashMap<>();

    private static class OtpData {

        private final String otp;
        private final Instant expiresAt;
        private int attempts;

        private OtpData(String otp) {
            this.otp = otp;
            this.expiresAt = Instant.now()
                    .plusSeconds(OTP_EXPIRY_SECONDS);
            this.attempts = 0;
        }
    }

    // Generate and store a new OTP
    public String generateOtp(String mobileNumber) {

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        otpStore.put(mobileNumber, new OtpData(otp));

        return otp;
    }

    // Verify OTP
    public boolean verifyOtp(String mobileNumber, String enteredOtp) {

        OtpData data = otpStore.get(mobileNumber);

        if (data == null) {
            throw new IllegalArgumentException(
                    "OTP not found. Please request a new OTP."
            );
        }

        // Check expiry
        if (Instant.now().isAfter(data.expiresAt)) {
            otpStore.remove(mobileNumber);

            throw new IllegalArgumentException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // Check maximum attempts
        if (data.attempts >= MAX_ATTEMPTS) {
            otpStore.remove(mobileNumber);

            throw new IllegalArgumentException(
                    "Maximum OTP attempts exceeded. Request a new OTP."
            );
        }

        // Check entered OTP
        if (!data.otp.equals(enteredOtp)) {

            data.attempts++;

            if (data.attempts >= MAX_ATTEMPTS) {
                otpStore.remove(mobileNumber);

                throw new IllegalArgumentException(
                        "Maximum OTP attempts exceeded. Request a new OTP."
                );
            }

            throw new IllegalArgumentException(
                    "Incorrect OTP. Attempts remaining: "
                            + (MAX_ATTEMPTS - data.attempts)
            );
        }

        // OTP verified successfully
        otpStore.remove(mobileNumber);

        return true;
    }

    // Get remaining OTP expiry time
    public long getRemainingSeconds(String mobileNumber) {

        OtpData data = otpStore.get(mobileNumber);

        if (data == null) {
            return 0;
        }

        long remaining = data.expiresAt.getEpochSecond()
                - Instant.now().getEpochSecond();

        return Math.max(0, remaining);
    }
}
