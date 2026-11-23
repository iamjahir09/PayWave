package com.paywave.repository;

import com.paywave.entity.BillPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillPaymentRepository extends JpaRepository<BillPayment, Long> {
    List<BillPayment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
