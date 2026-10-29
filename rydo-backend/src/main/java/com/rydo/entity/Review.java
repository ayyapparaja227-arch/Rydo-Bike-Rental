package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long bookingId;
    
    @Column(nullable = false)
    private Long bikeId;
    
    @Column(nullable = false)
    private Long reviewerId;
    
    @Column(nullable = false)
    private Long reviewedUserId; // Could be owner or renter
    
    @Column(nullable = false)
    private Integer rating; // 1-5 stars
    
    @Column(length = 1000)
    private String comment;
    
    private String reviewType; // BIKE, USER
    
    private Integer helpfulCount = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
