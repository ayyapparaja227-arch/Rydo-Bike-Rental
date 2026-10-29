package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long bikeId;
    
    @Column(nullable = false)
    private Long renterId;
    
    @Column(nullable = false)
    private Long ownerId;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @Column(nullable = false)
    private Integer hours;
    
    @Column(nullable = false)
    private Double basePrice;
    
    private Double surgeMultiplier = 1.0;
    
    private Double platformFee;
    
    @Column(nullable = false)
    private Double totalPrice;
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED
    
    private String pickupOtp;
    
    private String returnOtp;
    
    private String paymentId;
    
    private Boolean paymentCompleted = false;
    
    private Long safetyCheckId;
    
    private Integer earnedCoins = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime confirmedAt;
    
    private LocalDateTime completedAt;
    
    private String cancellationReason;
}
