package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_checks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyCheck {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long bookingId;
    
    @Column(nullable = false)
    private Long bikeId;
    
    @Column(nullable = false)
    private Long userId;
    
    private String videoUrl;
    
    @Column(length = 2000)
    private String aiAnalysis; // Mock AI result as JSON string
    
    private Boolean scratchesDetected = false;
    
    private Boolean dentsDetected = false;
    
    private Boolean tyreConditionGood = true;
    
    private Boolean mirrorConditionGood = true;
    
    private Double safetyScore = 100.0; // 0-100
    
    private String checkType; // PRE_RIDE, POST_RIDE
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
