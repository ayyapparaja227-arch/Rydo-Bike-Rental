package com.rydo.service;

import com.rydo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class PricingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    /**
     * Calculate dynamic surge pricing multiplier
     * Based on demand (bookings in area/time) and peak hours
     */
    public double calculateSurgeMultiplier(Long bikeId, LocalDateTime startTime) {
        double multiplier = 1.0;
        
        // Peak hours surge (8-10 AM, 5-8 PM)
        LocalTime time = startTime.toLocalTime();
        if (isPeakHour(time)) {
            multiplier += 0.2; // 20% surge
        }
        
        // Weekend surge
        int dayOfWeek = startTime.getDayOfWeek().getValue();
        if (dayOfWeek == 6 || dayOfWeek == 7) { // Saturday or Sunday
            multiplier += 0.15; // 15% surge
        }
        
        // High demand detection (mock - based on recent bookings)
        // In production, this would analyze real-time booking patterns
        long recentBookings = bookingRepository.count();
        if (recentBookings > 50) {
            multiplier += 0.25; // 25% surge for high demand
        }
        
        // Cap maximum surge at 1.4x (40% increase)
        return Math.min(multiplier, 1.4);
    }
    
    /**
     * Get discount multiplier for low-demand periods
     */
    public double getDiscountMultiplier(Long bikeId, LocalDateTime startTime) {
        // Off-peak discount
        LocalTime time = startTime.toLocalTime();
        if (isOffPeak(time)) {
            return 0.85; // 15% discount
        }
        
        return 1.0; // No discount
    }
    
    /**
     * Check if time is during peak hours
     */
    private boolean isPeakHour(LocalTime time) {
        return (time.isAfter(LocalTime.of(8, 0)) && time.isBefore(LocalTime.of(10, 0))) ||
               (time.isAfter(LocalTime.of(17, 0)) && time.isBefore(LocalTime.of(20, 0)));
    }
    
    /**
     * Check if time is during off-peak hours
     */
    private boolean isOffPeak(LocalTime time) {
        return time.isAfter(LocalTime.of(22, 0)) || time.isBefore(LocalTime.of(6, 0));
    }
}
