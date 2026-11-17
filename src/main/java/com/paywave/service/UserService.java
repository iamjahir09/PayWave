package com.paywave.service;

import com.paywave.dto.UserRequest;
import com.paywave.entity.User;
import com.paywave.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService (UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    public Long registerUser(UserRequest request){
        if(isEmailRegistered(request.getEmail())){
            throw new IllegalArgumentException("Email already registered");
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

        User savedUser = userRepository.save(user);

        return savedUser.getId();
    }
}
