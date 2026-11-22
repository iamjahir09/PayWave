package com.paywave.repository;
import java.util.*;
import com.paywave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNumber(String mobileNumber);
    boolean existsByPaywaveId(String paywaveId);
    Optional<User> findByPaywaveId(String paywaveId);
}
