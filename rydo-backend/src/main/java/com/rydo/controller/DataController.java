package com.rydo.controller;

import com.rydo.entity.*;
import com.rydo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DataController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private AvailabilitySlotRepository slotRepository;
    
    @PostMapping("/populate-demo-data")
    @Transactional
    public ResponseEntity<?> populateDemoData() {
        try {
            // Create demo users
            List<User> users = createDemoUsers();
            
            // Create demo bikes
            List<Bike> bikes = createDemoBikes(users);
            
            // Create availability slots
            createAvailabilitySlots(bikes);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Demo data created successfully!");
            response.put("usersCreated", users.size());
            response.put("bikesCreated", bikes.size());
            response.put("users", users.stream().map(u -> Map.of(
                "email", u.getEmail(),
                "name", u.getName(),
                "role", u.getRole(),
                "password", "pass123"
            )).toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    private List<User> createDemoUsers() {
        List<User> users = new ArrayList<>();
        
        // Create owner users
        users.add(createUser("Rahul Sharma", "rahul@gmail.com", "pass123", "9876543210", "OWNER", 95.0, 450));
        users.add(createUser("Priya Patel", "priya@gmail.com", "pass123", "9876543211", "OWNER", 98.0, 620));
        users.add(createUser("Vikram Singh", "vikram@gmail.com", "pass123", "9876543214", "OWNER", 90.0, 580));
        users.add(createUser("Rohan Gupta", "rohan@gmail.com", "pass123", "9876543216", "OWNER", 96.0, 710));
        
        // Create renter users
        users.add(createUser("Amit Kumar", "amit@gmail.com", "pass123", "9876543212", "USER", 92.0, 180));
        users.add(createUser("Sneha Reddy", "sneha@gmail.com", "pass123", "9876543213", "USER", 97.0, 290));
        users.add(createUser("Anjali Verma", "anjali@gmail.com", "pass123", "9876543215", "USER", 94.0, 120));
        
        // Create admin
        users.add(createUser("Admin User", "admin@rydo.com", "admin123", "9999999999", "ADMIN", 100.0, 0));
        
        return userRepository.saveAll(users);
    }
    
    private User createUser(String name, String email, String password, String phone, String role, Double trustScore, Integer coins) {
        // Check if user already exists
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }
        
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
    
    private List<Bike> createDemoBikes(List<User> users) {
        List<Bike> bikes = new ArrayList<>();
        
        // Get owner users
        User owner1 = users.get(0); // Rahul
        User owner2 = users.get(1); // Priya
        User owner3 = users.get(2); // Vikram
        User owner4 = users.get(3); // Rohan
        
        // Tamil Nadu bikes
        bikes.add(createBike(owner1.getId(), "Royal Enfield", "Classic 350", 2022, "TN01AB1234", "CRUISER",
            "Perfect for long rides to Kerala. Well-maintained and serviced regularly.", "Chennai, T Nagar", 13.0418, 80.2341, 350.0, "PETROL", 35));
        
        bikes.add(createBike(owner1.getId(), "Honda", "Activa 6G", 2023, "TN01CD5678", "SCOOTER",
            "Comfortable city commute. Excellent fuel efficiency.", "Chennai, Anna Nagar", 13.0850, 80.2101, 200.0, "PETROL", 50));
        
        bikes.add(createBike(owner2.getId(), "TVS", "Apache RTR 160", 2023, "TN09GH3456", "SPORTS",
            "Sporty and stylish. Great handling and performance.", "Coimbatore, RS Puram", 11.0168, 76.9558, 280.0, "PETROL", 45));
        
        bikes.add(createBike(owner2.getId(), "Hero", "Splendor Plus", 2022, "TN38IJ7890", "COMMUTER",
            "Fuel-efficient daily commute bike. Very reliable.", "Madurai, Anna Nagar", 9.9252, 78.1198, 220.0, "PETROL", 60));
        
        // Kerala bikes
        bikes.add(createBike(owner3.getId(), "Bajaj", "Dominar 400", 2021, "KL01EF9012", "SPORTS",
            "Power-packed performance bike. Perfect for highway cruising.", "Kochi, MG Road", 9.9312, 76.2673, 400.0, "PETROL", 30));
        
        bikes.add(createBike(owner3.getId(), "KTM", "Duke 390", 2023, "KL07KL1234", "SPORTS",
            "Beast on the road! High performance street bike.", "Trivandrum, Technopark", 8.5574, 76.8814, 380.0, "PETROL", 25));
        
        bikes.add(createBike(owner4.getId(), "Yamaha", "FZ-S", 2022, "KL08MN5678", "COMMUTER",
            "Smooth city riding experience. Low maintenance.", "Kozhikode, Beach Road", 11.2588, 75.7804, 250.0, "PETROL", 40));
        
        bikes.add(createBike(owner4.getId(), "Ather", "450X", 2023, "KL01ST7890", "SCOOTER",
            "Electric future! Zero emissions, high performance.", "Kochi, Edappally", 10.0261, 76.3125, 300.0, "ELECTRIC", 85));

        // More Tamil Nadu scooters
        bikes.add(createBike(owner1.getId(), "Honda", "Activa 5G", 2022, "TN22DL1111", "SCOOTER",
            "Reliable city scooter. Perfect for daily commute.", "Salem, Fairlands", 11.6643, 78.1460, 200.0, "PETROL", 55));

        bikes.add(createBike(owner2.getId(), "TVS", "Jupiter 125", 2023, "TN45JK2222", "SCOOTER",
            "Comfortable ride with large boot space.", "Trichy, Thillai Nagar", 10.8150, 78.6869, 220.0, "PETROL", 50));

        bikes.add(createBike(owner3.getId(), "Honda", "Dio BS6", 2023, "TN59DO3333", "SCOOTER",
            "Sporty looks and great performance.", "Tirunelveli, Palayamkottai", 8.7139, 77.7567, 230.0, "PETROL", 48));
        
        return bikeRepository.saveAll(bikes);
    }
    
    private Bike createBike(Long ownerId, String brand, String model, Integer year, String numberPlate, 
                           String bikeType, String description, String location, Double lat, Double lng, 
                           Double price, String fuelType, Integer mileage) {
        Bike bike = new Bike();
        bike.setOwnerId(ownerId);
        bike.setBrand(brand);
        bike.setModel(model);
        bike.setYear(year);
        bike.setNumberPlate(numberPlate);
        bike.setBikeType(bikeType);
        bike.setDescription(description);
        bike.setLocation(location);
        bike.setLatitude(lat);
        bike.setLongitude(lng);
        bike.setHourlyPrice(price);
        bike.setFuelType(fuelType);
        bike.setMileage(mileage);
        bike.setStatus("APPROVED");
        bike.setAutoApproveBookings(true);
        bike.setDynamicPricing(true);
        bike.setAverageRating(4.5);
        bike.setTotalRides(0);
        bike.setActive(true);
        bike.setCreatedAt(LocalDateTime.now().minusDays(15));
        
        // Set bike images based on type
        // Set perfect model-specific images
        String modelKey = (brand + " " + model).toLowerCase();
        
        if (modelKey.contains("royal enfield") && modelKey.contains("classic")) {
            // Royal Enfield Classic 350 - Classic cruiser
            bike.setImageUrl1("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80");
        } else if (modelKey.contains("activa") && (modelKey.contains("6g") || modelKey.contains("5g"))) {
            // Honda Activa - White/Silver scooter
            bike.setImageUrl1("https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1641979347286-62c48c59e0cc?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800&q=80");
        } else if (modelKey.contains("jupiter")) {
            // TVS Jupiter - Orange/Brown scooter
            bike.setImageUrl1("https://images.unsplash.com/photo-1625043484555-47841a752840?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800&q=80");
        } else if (modelKey.contains("dio")) {
            // Honda Dio - Sporty scooter
            bike.setImageUrl1("https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1641979347286-62c48c59e0cc?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80");
        } else if (modelKey.contains("ather") && modelKey.contains("450")) {
            // Ather 450X - Modern electric scooter
            bike.setImageUrl1("https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1623055375523-2855593b955c?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1676317572703-94f572636306?w=800&q=80");
        } else if (modelKey.contains("ktm") && modelKey.contains("duke")) {
            // KTM Duke 390 - Orange sports
            bike.setImageUrl1("https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1599819177891-b7086c3f4de4?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1571936575103-e787c86809a7?w=800&q=80");
        } else if (modelKey.contains("dominar")) {
            // Bajaj Dominar - Black power cruiser
            bike.setImageUrl1("https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&q=80");
        } else if (modelKey.contains("apache")) {
            // TVS Apache - Red sports
            bike.setImageUrl1("https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1599819177891-b7086c3f4de4?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80");
        } else if (modelKey.contains("splendor")) {
            // Hero Splendor - Standard commuter
            bike.setImageUrl1("https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80");
        } else if (modelKey.contains("fz") || modelKey.contains("yamaha")) {
            // Yamaha FZ-S - Blue sportster
            bike.setImageUrl1("https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&q=80");
        } else {
            // Fallback for any other bikes
            bike.setImageUrl1("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80");
            bike.setImageUrl2("https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80");
            bike.setImageUrl3("https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80");
        }
        
        return bike;
    }
    
    private void createAvailabilitySlots(List<Bike> bikes) {
        LocalDateTime now = LocalDateTime.now();
        
        for (Bike bike : bikes) {
            // Create slots for next 7 days, 9 AM to 5 PM
            for (int day = 0; day < 7; day++) {
                LocalDateTime slotStart = now.plusDays(day).withHour(9).withMinute(0).withSecond(0);
                LocalDateTime slotEnd = slotStart.plusHours(8);
                
                AvailabilitySlot slot = new AvailabilitySlot();
                slot.setBikeId(bike.getId());
                slot.setStartTime(slotStart);
                slot.setEndTime(slotEnd);
                slot.setStatus("AVAILABLE");
                slot.setCreatedAt(LocalDateTime.now());
                
                slotRepository.save(slot);
            }
        }
    }
}
