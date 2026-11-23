package com.paywave.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SplitExpenseResponse {
    private Long id;
    private String title, createdByPaywaveId;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<Share> shares;

    public SplitExpenseResponse(Long id, String title, BigDecimal total, String creator, LocalDateTime at,
            List<Share> shares) {
        this.id = id;
        this.title = title;
        totalAmount = total;
        createdByPaywaveId = creator;
        createdAt = at;
        this.shares = shares;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getCreatedByPaywaveId() {
        return createdByPaywaveId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Share> getShares() {
        return shares;
    }

    public static class Share {
        private Long shareId;
        private String paywaveId, status;
        private BigDecimal amount;

        public Share(Long id, String p, BigDecimal a, String s) {
            shareId = id;
            paywaveId = p;
            amount = a;
            status = s;
        }

        public Long getShareId() {
            return shareId;
        }

        public String getPaywaveId() {
            return paywaveId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public String getStatus() {
            return status;
        }
    }
}
