package com.paywave.repository;

import com.paywave.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    Optional<RevokedToken> findByTokenHash(String tokenHash);
    boolean existsByTokenHash(String tokenHash);
}
