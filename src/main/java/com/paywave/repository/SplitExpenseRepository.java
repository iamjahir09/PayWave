package com.paywave.repository;

import com.paywave.entity.SplitExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SplitExpenseRepository extends JpaRepository<SplitExpense, Long> {
    List<SplitExpense> findDistinctByCreatedByIdOrSharesUserIdOrderByCreatedAtDesc(Long creatorId, Long participantId);
}
