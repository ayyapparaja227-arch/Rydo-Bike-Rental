package com.rydo.service;

import com.rydo.dto.BookingRequest;
import com.rydo.entity.Bike;
import com.rydo.entity.Booking;
import com.rydo.entity.User;
import com.rydo.repository.BikeRepository;
import com.rydo.repository.BookingRepository;
import com.rydo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @Autowired
    private PricingService pricingService;
    
    @Autowired
    private EarnCoinsService earnCoinsService;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Create a new booking
     */
    public Booking createBooking(BookingRequest request) {
        // Validate bike exists
        Optional<Bike> bikeOpt = bikeRepository.findById(request.getBikeId());
        if (bikeOpt.isEmpty()) {
            throw new RuntimeException("Bike not found");
        }
        Bike bike = bikeOpt.get();
        
        // Handle hours-based booking (if startTime/endTime not provided)
        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();
        int hours = 0;
        
        if (startTime == null || endTime == null) {
            // Use hours-based booking (simple booking from now)
            if (request.getHours() == null) {
                throw new RuntimeException("Either provide startTime/endTime or number of hours");
            }
            startTime = LocalDateTime.now();
            endTime = startTime.plusHours(request.getHours());
            hours = request.getHours();
        } else {
            // Calculate hours from timestamps
            long minutes = Duration.between(startTime, endTime).toMinutes();
            hours = (int) Math.ceil(minutes / 60.0);
        }
        
        // Check availability (skip for now to allow booking)
        // List<com.rydo.entity.AvailabilitySlot> availableSlots = availabilityService
        //     .getAvailableSlots(request.getBikeId(), startTime, endTime);
        // 
        // if (availableSlots.isEmpty()) {
        //     throw new RuntimeException("Bike not available for selected time");
        // }
        
        
        // Calculate pricing with dynamic surge
        double basePrice = bike.getHourlyPrice() * hours;
        double surgeMultiplier = pricingService.calculateSurgeMultiplier(
            request.getBikeId(), 
            startTime
        );
        double platformFee = basePrice * surgeMultiplier * 0.08; // 8% platform fee
        double totalPrice = basePrice * surgeMultiplier + platformFee;
        
        // Create booking
        Booking booking = new Booking();
        booking.setBikeId(request.getBikeId());
        booking.setRenterId(request.getRenterId());
        booking.setOwnerId(bike.getOwnerId());
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setHours(hours);
        booking.setBasePrice(basePrice);
        booking.setSurgeMultiplier(surgeMultiplier);
        booking.setPlatformFee(platformFee);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(bike.getAutoApproveBookings() ? "CONFIRMED" : "PENDING");
        booking.setPickupOtp(generateOTP());
        booking.setReturnOtp(generateOTP());
        booking.setCreatedAt(LocalDateTime.now());
        
        Booking saved = bookingRepository.save(booking);
        
        // Send notification to owner
        notificationService.notifyOwnerOfNewBooking(saved);
        
        // Send confirmation to renter if auto-approved
        if (bike.getAutoApproveBookings()) {
            notificationService.notifyRenterOfConfirmation(saved);
        }
        
        // Mark slots as booked if auto-approved
        if (bike.getAutoApproveBookings()) {
            availabilityService.markSlotsAsBooked(
                request.getBikeId(), 
                startTime, 
                endTime, 
                saved.getId()
            );
        }
        
        return saved;
    }
    
    /**
     * Confirm a pending booking (by owner)
     */
    public Booking confirmBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        booking.setStatus("CONFIRMED");
        booking.setConfirmedAt(LocalDateTime.now());
        
        // Mark slots as booked
        availabilityService.markSlotsAsBooked(
            booking.getBikeId(), 
            booking.getStartTime(), 
            booking.getEndTime(), 
            booking.getId()
        );
        
        return bookingRepository.save(booking);
    }
    
    /**
     * Cancel a booking
     */
    public Booking cancelBooking(Long bookingId, String reason) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        booking.setStatus("CANCELLED");
        booking.setCancellationReason(reason);
        
        // Release slots
        availabilityService.releaseSlotsFromBooking(bookingId);
        
        return bookingRepository.save(booking);
    }
    
    /**
     * Complete a booking and award EarnCoins
     */
    public Booking completeBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        booking.setStatus("COMPLETED");
        booking.setCompletedAt(LocalDateTime.now());
        
        // Award EarnCoins
        int coinsEarned = earnCoinsService.awardCoinsForBooking(booking);
        booking.setEarnedCoins(coinsEarned);
        
        return bookingRepository.save(booking);
    }
    
    /**
     * Get booking by ID
     */
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    /**
     * Get renter's bookings
     */
    public List<Booking> getRenterBookings(Long renterId) {
        return bookingRepository.findByRenterId(renterId);
    }
    
    /**
     * Get owner's bookings
     */
    public List<Booking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId);
    }
    
    /**
     * Get pending bookings for owner approval
     */
    public List<Booking> getPendingBookingsForOwner(Long ownerId) {
        return bookingRepository.findPendingBookingsByOwner(ownerId);
    }
    
    /**
     * Generate random OTP
     */
    private String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
