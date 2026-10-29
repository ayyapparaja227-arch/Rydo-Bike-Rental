package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long bookingId;
    
    @Column(nullable = false)
    private Long renterId;
    
    @Column(nullable = false)
    private Long ownerId;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private Double platformFee;
    
    @Column(nullable = false)
    private Double ownerEarning;
    
    private String transactionType; // BOOKING, REFUND, COIN_PURCHASE
    
    private String paymentMethod; // CARD, UPI, WALLET, EARNCOINS
    
    private String paymentStatus; // SUCCESS, PENDING, FAILED
    
    private String transactionId;
    
    private Integer coinsUsed = 0;
    
    private Integer coinsEarned = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
