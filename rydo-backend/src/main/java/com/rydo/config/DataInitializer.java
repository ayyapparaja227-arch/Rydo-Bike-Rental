package com.rydo.config;

import com.rydo.entity.*;
import com.rydo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.DependsOn;
import org.springframework.transaction.annotation.Transactional;

// @Component - Disabled automatic initialization, use /api/admin/init-data endpoint instead
@DependsOn("entityManagerFactory")
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private AvailabilitySlotRepository slotRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("🌱 Initializing demo data...");
        
        // Create demo users
        createUsers();
        
        // Create demo bikes
        createBikes();
        
        // Create availability slots
        createAvailabilitySlots();
        
        // Create demo bookings
        createBookings();
        
        // Create demo reviews
        createReviews();
        
        System.out.println("✅ Demo data initialized successfully!");
        System.out.println("📊 Users: " + userRepository.count());
        System.out.println("🚲 Bikes: " + bikeRepository.count());
        System.out.println("📅 Availability Slots: " + slotRepository.count());
        System.out.println("📝 Bookings: " + bookingRepository.count());
        System.out.println("⭐ Reviews: " + reviewRepository.count());
    }
    
    private void createUsers() {
        List<User> users = Arrays.asList(
            createUser(1L, "Admin User", "admin@rydo.com", "admin123", "9999999999", "ADMIN", 100.0, 0),
            createUser(2L, "Rahul Sharma", "rahul@gmail.com", "pass123", "9876543210", "OWNER", 95.0, 450),
            createUser(3L, "Priya Patel", "priya@gmail.com", "pass123", "9876543211", "OWNER", 98.0, 620),
            createUser(4L, "Amit Kumar", "amit@gmail.com", "pass123", "9876543212", "USER", 92.0, 180),
            createUser(5L, "Sneha Reddy", "sneha@gmail.com", "pass123", "9876543213", "USER", 97.0, 290),
            createUser(6L, "Vikram Singh", "vikram@gmail.com", "pass123", "9876543214", "OWNER", 90.0, 580),
            createUser(7L, "Anjali Verma", "anjali@gmail.com", "pass123", "9876543215", "USER", 94.0, 120),
            createUser(8L, "Rohan Gupta", "rohan@gmail.com", "pass123", "9876543216", "OWNER", 96.0, 710)
        );
        
        userRepository.saveAll(users);
    }
    
    private User createUser(Long id, String name, String email, String password, String phone, String role, Double trustScore, Integer coins) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setPhone(phone);
        user.setRole(role);
        user.setTrustScore(trustScore);
        user.setEarnCoins(coins);
        user.setVerified(true);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now().minusDays(30));
        return user;
    }
    
    private void createBikes() {
        List<Bike> bikes = Arrays.asList(
            createBike(1L, 2L, "Royal Enfield", "Classic 350", 2022, "MH01AB1234", "CRUISER", 
                "Perfect for long rides", "Mumbai, Andheri", 19.1136, 72.8697, 80.0, "PETROL", 35, "APPROVED"),
            createBike(2L, 2L, "Honda", "Activa 6G", 2023, "MH01CD5678", "SCOOTER", 
                "Comfortable city commute", "Mumbai, Bandra", 19.0596, 72.8295, 40.0, "PETROL", 50, "APPROVED"),
            createBike(3L, 3L, "Bajaj", "Dominar 400", 2021, "MH02EF9012", "SPORTS", 
                "Power-packed performance", "Mumbai, Powai", 19.1197, 72.9058, 100.0, "PETROL", 30, "APPROVED"),
            createBike(4L, 3L, "TVS", "Apache RTR 160", 2023, "MH03GH3456", "SPORTS", 
                "Sporty and stylish", "Pune, Koregaon Park", 18.5362, 73.8958, 70.0, "PETROL", 45, "APPROVED"),
            createBike(5L, 6L, "Hero", "Splendor Plus", 2022, "MH04IJ7890", "COMMUTER", 
                "Fuel-efficient daily commute", "Pune, Hinjewadi", 18.5912, 73.7389, 50.0, "PETROL", 60, "APPROVED"),
            createBike(6L, 6L, "KTM", "Duke 390", 2023, "MH05KL1234", "SPORTS", 
                "Beast on the road", "Bangalore, Koramangala", 12.9352, 77.6245, 120.0, "PETROL", 25, "APPROVED"),
            createBike(7L, 8L, "Yamaha", "FZ-S", 2022, "KA01MN5678", "COMMUTER", 
                "Smooth city riding", "Bangalore, Indiranagar", 12.9716, 77.6412, 65.0, "PETROL", 40, "APPROVED"),
            createBike(8L, 8L, "Suzuki", "Gixxer SF", 2023, "KA02OP9012", "SPORTS", 
                "Track-ready bike", "Bangalore, Whitefield", 12.9698, 77.7499, 85.0, "PETROL", 42, "APPROVED"),
            createBike(9L, 2L, "Honda", "CB Shine", 2021, "MH01QR3456", "COMMUTER", 
                "Reliable and comfortable", "Mumbai, Goregaon", 19.1646, 72.8493, 55.0, "PETROL", 55, "APPROVED"),
            createBike(10L, 3L, "Ather", "450X", 2023, "MH02ST7890", "SCOOTER", 
                "Electric future", "Mumbai, Lower Parel", 19.0144, 72.8317, 90.0, "ELECTRIC", 85, "APPROVED"),
            createBike(11L, 6L, "Bajaj", "Pulsar NS200", 2022, "KA03UV1234", "SPORTS", 
                "Street fighter", "Bangalore, HSR Layout", 12.9121, 77.6446, 95.0, "PETROL", 38, "PENDING"),
            createBike(12L, 8L, "Royal Enfield", "Himalayan", 2023, "KA04WX5678", "CRUISER", 
                "Adventure awaits", "Bangalore, JP Nagar", 12.9082, 77.5855, 110.0, "PETROL", 32, "PENDING")
        );
        
        bikeRepository.saveAll(bikes);
    }
    
    private Bike createBike(Long id, Long ownerId, String brand, String model, Integer year, 
                           String numberPlate, String bikeType, String desc, String location, 
                           Double lat, Double lng, Double price, String fuel, Integer mileage, String status) {
        Bike bike = new Bike();
        bike.setOwnerId(ownerId);
        bike.setBrand(brand);
        bike.setModel(model);
        bike.setYear(year);
        bike.setNumberPlate(numberPlate);
        bike.setBikeType(bikeType);
        bike.setDescription(desc);
        bike.setLocation(location);
        bike.setLatitude(lat);
        bike.setLongitude(lng);
        bike.setHourlyPrice(price);
        bike.setFuelType(fuel);
        bike.setMileage(mileage);
        bike.setStatus(status);
        bike.setAutoApproveBookings(true);
        bike.setDynamicPricing(true);
        bike.setAverageRating(4.5);
        bike.setTotalRides(0);
        bike.setActive(true);
        bike.setCreatedAt(LocalDateTime.now().minusDays(15));
        bike.setImageUrl1("https://via.placeholder.com/400x300?text=" + brand + "+" + model);
        bike.setImageUrl2("https://via.placeholder.com/400x300?text=Bike+Side+View");
        bike.setImageUrl3("https://via.placeholder.com/400x300?text=Bike+Details");
        return bike;
    }
    
    private void createAvailabilitySlots() {
        // Create slots for next 7 days for each bike
        LocalDateTime now = LocalDateTime.now();
        
        for (long bikeId = 1; bikeId <= 10; bikeId++) {
            for (int day = 0; day < 7; day++) {
                LocalDateTime slotStart = now.plusDays(day).withHour(9).withMinute(0).withSecond(0);
                LocalDateTime slotEnd = slotStart.plusHours(8); // 9 AM to 5 PM
                
                AvailabilitySlot slot = new AvailabilitySlot();
                slot.setBikeId(bikeId);
                slot.setStartTime(slotStart);
                slot.setEndTime(slotEnd);
                slot.setStatus("AVAILABLE");
                slot.setCreatedAt(LocalDateTime.now());
                
                slotRepository.save(slot);
            }
        }
    }
    
    private void createBookings() {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        
        Booking booking1 = new Booking();
        booking1.setBikeId(1L);
        booking1.setRenterId(4L);
        booking1.setOwnerId(2L);
        booking1.setStartTime(tomorrow);
        booking1.setEndTime(tomorrow.plusHours(3));
        booking1.setHours(3);
        booking1.setBasePrice(240.0);
        booking1.setSurgeMultiplier(1.0);
        booking1.setPlatformFee(19.2);
        booking1.setTotalPrice(259.2);
        booking1.setStatus("CONFIRMED");
        booking1.setPickupOtp("123456");
        booking1.setReturnOtp("654321");
        booking1.setCreatedAt(LocalDateTime.now().minusHours(2));
        booking1.setConfirmedAt(LocalDateTime.now().minusHours(1));
        
        bookingRepository.save(booking1);
    }
    
    private void createReviews() {
        Review review1 = new Review();
        review1.setBookingId(1L);
        review1.setBikeId(1L);
        review1.setReviewerId(4L);
        review1.setReviewedUserId(2L);
        review1.setRating(5);
        review1.setComment("Excellent bike! Very well maintained and smooth ride.");
        review1.setReviewType("BIKE");
        review1.setCreatedAt(LocalDateTime.now().minusDays(5));
        
        reviewRepository.save(review1);
    }
}
