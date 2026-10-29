package com.rydo.service;

import com.rydo.entity.Bike;
import com.rydo.entity.User;
import com.rydo.repository.BikeRepository;
import com.rydo.repository.BookingRepository;
import com.rydo.repository.TransactionRepository;
import com.rydo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Get pending bike listings
     */
    public List<Bike> getPendingBikes() {
        return bikeRepository.findByStatus("PENDING");
    }
    
    /**
     * Ban/unban user
     */
    public User toggleUserBan(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setActive(!user.getActive());
        return userRepository.save(user);
    }
    
    /**
     * Get platform analytics
     */
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // User stats
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByActive(true).size();
        
        // Bike stats
        long totalBikes = bikeRepository.count();
        long approvedBikes = bikeRepository.findByStatus("APPROVED").size();
        long pendingBikes = bikeRepository.findByStatus("PENDING").size();
        
        // Booking stats
        long totalBookings = bookingRepository.count();
        long completedBookings = bookingRepository.findByStatus("COMPLETED").size();
        long activeBookings = bookingRepository.findByStatus("CONFIRMED").size();
        
        // Revenue
        Double totalRevenue = transactionRepository.calculateTotalPlatformRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;
        
        analytics.put("totalUsers", totalUsers);
        analytics.put("activeUsers", activeUsers);
        analytics.put("totalBikes", totalBikes);
        analytics.put("approvedBikes", approvedBikes);
        analytics.put("pendingBikes", pendingBikes);
        analytics.put("totalBookings", totalBookings);
        analytics.put("completedBookings", completedBookings);
        analytics.put("activeBookings", activeBookings);
        analytics.put("platformRevenue", totalRevenue);
        
        return analytics;
    }
}
