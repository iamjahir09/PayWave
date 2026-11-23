package com.paywave.repository;

import com.paywave.entity.SplitExpenseShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SplitExpenseShareRepository extends JpaRepository<SplitExpenseShare, Long> {
    Optional<SplitExpenseShare> findByIdAndUserId(Long id, Long userId);
}
