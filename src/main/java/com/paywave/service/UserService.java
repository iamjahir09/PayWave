package com.paywave.service;

import com.paywave.dto.LoginRequest;
import com.paywave.dto.LoginResponse;
import com.paywave.dto.UserRequest;
import com.paywave.dto.UserResponse;
import com.paywave.entity.User;
import com.paywave.exception.EmailAlreadyExistsException;
import com.paywave.exception.InvalidCredentialsException;
import com.paywave.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public UserService (UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setUserId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setMessage("User Registered Successfully");

        return response;
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
}
