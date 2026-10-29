package com.rydo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    private String profilePicUrl;
    
    @Column(nullable = false)
    private String role = "USER"; // USER, OWNER, ADMIN
    
    private Double trustScore = 100.0;
    
    private Integer earnCoins = 0;
    
    private Integer totalRides = 0;
    
    private Integer bikesListed = 0;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    private String aadharNumber;
    
    private String licenseNumber;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime lastLoginAt;
    
    @Column(nullable = false)
    private Boolean active = true;
}
