package com.paywave.service;

import com.paywave.dto.*;
import com.paywave.entity.User;
import com.paywave.entity.Wallet;
import com.paywave.exception.EmailAlreadyExistsException;
import com.paywave.exception.InvalidCredentialsException;
import com.paywave.repository.UserRepository;
import com.paywave.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WalletRepository walletRepository;
    public UserService (UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, WalletRepository walletRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.walletRepository = walletRepository;
    }

    public boolean isEmailRegistered(String email){
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean isMobileRegistered(String mobileNumber){
        return userRepository.findByMobileNumber(mobileNumber).isPresent();
    }

    public String hashPassword(String rawPassword){
        return passwordEncoder.encode(rawPassword);
    }

    @Transactional
    public UserResponse registerUser(UserRequest request){
        if(isEmailRegistered(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already registered");
        }

        if(isMobileRegistered(request.getMobileNumber())){
            throw new IllegalArgumentException("Mobile Number already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        String hashedPassword = hashPassword(request.getPassword());
        user.setPasswordHash(hashedPassword);

        String hashedmpin = passwordEncoder.encode(request.getMpin());
        user.setMpin_hash(hashedmpin);

        user.setPaywaveId(generatePaywaveId(request.getName()));

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setCurrency("INR");
        wallet.setCreated_at(LocalDateTime.now());
        walletRepository.save(wallet);

        UserResponse response = new UserResponse();
        response.setUserId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setPaywaveId(savedUser.getPaywaveId());
        response.setMessage("User Registered Successfully");

        return response;
    }

    public String generatePaywaveId(String name){
        String baseName = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");

        if(baseName.isBlank()){
            baseName = "user";
        }

        String paywaveId;
        do{
            int suffix = (int) (1000+Math.random()*9000);
            paywaveId = baseName + suffix + "@paywave";
        }while (userRepository.existsByPaywaveId(paywaveId));

        return paywaveId;
    }
    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseThrow(()-> new InvalidCredentialsException("Invalid mobile number or MPIN"));

        boolean isMpinCorrect = passwordEncoder.matches(request.getMpin(), user.getMpin_hash());

        if(!isMpinCorrect){
            throw new InvalidCredentialsException("Invalid mobile number or MPIN");
        }

        String token = jwtService.generateToken(user.getId());
        return new LoginResponse(token, "Login Successful");
    }

    public UserProfileResponse getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !(authentication.getPrincipal() instanceof Long)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Long userId = (Long) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getMobileNumber(),
                user.getEmail()
        );
    }

    @Transactional
    public UserProfileResponse updateMyProfile(UpdateProfileRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !(authentication.getPrincipal() instanceof Long)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Long userId = (Long) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if(existingUser.isPresent() && existingUser.get().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getMobileNumber(),
                updatedUser.getEmail()
        );
    }

    @Transactional
    public void changeMpin(ChangeMpinRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !(authentication.getPrincipal() instanceof Long)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authorized");
        }

        Long userId = (Long) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean isCurrentMpinCorrect = passwordEncoder.matches(request.getCurrentMpin(), user.getMpin_hash());

        if(!isCurrentMpinCorrect){
            throw new InvalidCredentialsException("Current Mpin is incorrect");
        }

        if(passwordEncoder.matches(request.getNewMpin(), user.getMpin_hash())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New MPIN must be different from current MPIN");
        }

        String hashedNewMpin = passwordEncoder.encode(request.getNewMpin());

        user.setMpin_hash(hashedNewMpin);
        userRepository.save(user);
    }

    public UserQrResponse getMyQrCode(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        String qrPayload = "paywave://pay?paywaveId="+ user.getPaywaveId();

        return new UserQrResponse(
                user.getName(),
                user.getPaywaveId(),
                qrPayload
        );
    }
}
