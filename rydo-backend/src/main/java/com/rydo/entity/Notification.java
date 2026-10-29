package com.rydo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId; // Recipient user ID
    
    @Column(nullable = false)
    private String type; // BOOKING_CREATED, BOOKING_CONFIRMED, BOOKING_CANCELLED, MESSAGE_RECEIVED, etc.
    
    @Column(nullable = false, length = 500)
    private String message;
    
    @Column(name = "related_entity_id")
    private Long relatedEntityId; // e.g., booking ID, message ID
    
    @Column(name = "related_entity_type")
    private String relatedEntityType; // BOOKING, MESSAGE, BIKE, etc.
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
