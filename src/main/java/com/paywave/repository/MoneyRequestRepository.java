package com.paywave.repository;

import com.paywave.entity.MoneyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface MoneyRequestRepository extends JpaRepository<MoneyRequest, Long> {
    List<MoneyRequest> findByRequesterIdOrPayerIdOrderByCreatedAtDesc(Long requesterId, Long payerId);

    Optional<MoneyRequest> findByIdAndPayerId(Long id, Long payerId);
}
