package com.paywave.repository;

import com.paywave.entity.PaymentReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface PaymentReminderRepository extends JpaRepository<PaymentReminder, Long> {
    List<PaymentReminder> findByUserIdOrderByDueDateAsc(Long userId);

    Optional<PaymentReminder> findByIdAndUserId(Long id, Long userId);
}
