package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bikes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long ownerId;
    
    @Column(nullable = false)
    private String brand;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false)
    private String numberPlate;
    
    @Column(nullable = false)
    private String bikeType; // SPORTS, CRUISER, COMMUTER, SCOOTER
    
    @Column(nullable = false)
    private Double hourlyPrice;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl1;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl2;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl3;
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE
    
    private Boolean autoApproveBookings = false;
    
    private Boolean dynamicPricing = false;
    
    private Double averageRating = 0.0;
    
    private Integer totalRides = 0;
    
    private String fuelType; // PETROL, ELECTRIC
    
    private Integer mileage; // km/l or km/charge
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Boolean active = true;
}
