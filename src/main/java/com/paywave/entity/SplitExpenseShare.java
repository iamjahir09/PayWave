package com.paywave.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "split_expense_shares")
public class SplitExpenseShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private SplitExpense expense;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal shareAmount;
    @Column(nullable = false)
    private String status;
    private LocalDateTime settledAt;

    public Long getId() {
        return id;
    }

    public SplitExpense getExpense() {
        return expense;
    }

    public void setExpense(SplitExpense v) {
        expense = v;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User v) {
        user = v;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal v) {
        shareAmount = v;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String v) {
        status = v;
    }

    public LocalDateTime getSettledAt() {
        return settledAt;
    }

    public void setSettledAt(LocalDateTime v) {
        settledAt = v;
    }
}
