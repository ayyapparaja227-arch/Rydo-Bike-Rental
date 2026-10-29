package com.rydo.service;

import com.rydo.entity.Notification;
import com.rydo.entity.Booking;
import com.rydo.entity.Bike;
import com.rydo.entity.User;
import com.rydo.repository.NotificationRepository;
import com.rydo.repository.BikeRepository;
import com.rydo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Create notification when a new booking is created
     */
    public void notifyOwnerOfNewBooking(Booking booking) {
        Optional<Bike> bikeOpt = bikeRepository.findById(booking.getBikeId());
        Optional<User> renterOpt = userRepository.findById(booking.getRenterId());
        
        if (bikeOpt.isPresent() && renterOpt.isPresent()) {
            Bike bike = bikeOpt.get();
            User renter = renterOpt.get();
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
            String startTimeStr = booking.getStartTime().format(formatter);
            
            String message = String.format(
                "🎉 New booking! %s booked your %s %s for %d hours starting %s. Total: ₹%.2f",
                renter.getName(),
                bike.getBrand(),
                bike.getModel(),
                booking.getHours(),
                startTimeStr,
                booking.getTotalPrice()
            );
            
            Notification notification = new Notification();
            notification.setUserId(booking.getOwnerId());
            notification.setType("BOOKING_CREATED");
            notification.setMessage(message);
            notification.setRelatedEntityId(booking.getId());
            notification.setRelatedEntityType("BOOKING");
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
        }
    }
    
    /**
     * Create notification when booking is confirmed
     */
    public void notifyRenterOfConfirmation(Booking booking) {
        Optional<Bike> bikeOpt = bikeRepository.findById(booking.getBikeId());
        
        if (bikeOpt.isPresent()) {
            Bike bike = bikeOpt.get();
            
            String message = String.format(
                "✅ Booking confirmed! Your booking for %s %s has been confirmed. Pickup OTP: %s",
                bike.getBrand(),
                bike.getModel(),
                booking.getPickupOtp()
            );
            
            Notification notification = new Notification();
            notification.setUserId(booking.getRenterId());
            notification.setType("BOOKING_CONFIRMED");
            notification.setMessage(message);
            notification.setRelatedEntityId(booking.getId());
            notification.setRelatedEntityType("BOOKING");
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
        }
    }
    
    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get unread notifications
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get unread count
     */
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
    }
    
    /**
     * Mark all notifications as read
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }
}
