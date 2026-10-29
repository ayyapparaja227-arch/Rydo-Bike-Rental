package com.rydo.service;

import com.rydo.entity.Bike;
import com.rydo.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BikeService {
    
    @Autowired
    private BikeRepository bikeRepository;
    
    public Bike createBike(Bike bike) {
        // Set defaults for optional fields
        if (bike.getFuelType() == null || bike.getFuelType().isEmpty()) {
            bike.setFuelType("PETROL");
        }
        if (bike.getMileage() == null) {
            bike.setMileage(45); // Default mileage
        }
        if (bike.getAutoApproveBookings() == null) {
            bike.setAutoApproveBookings(true);
        }
        if (bike.getDynamicPricing() == null) {
            bike.setDynamicPricing(false);
        }
        
        bike.setStatus("PENDING"); // Requires admin approval
        bike.setCreatedAt(LocalDateTime.now());
        bike.setActive(true);
        bike.setAverageRating(0.0);
        bike.setTotalRides(0);
        
        return bikeRepository.save(bike);
    }
    
    public Optional<Bike> getBikeById(Long id) {
        return bikeRepository.findById(id);
    }
    
    public List<Bike> getAllBikes() {
        return bikeRepository.findByActiveTrue();
    }
    
    public List<Bike> searchBikes(String location, String bikeType, Double minPrice, Double maxPrice) {
        return bikeRepository.searchBikes(location, bikeType, minPrice, maxPrice);
    }
    
    public List<Bike> getFeaturedBikes() {
        return bikeRepository.findFeaturedBikes();
    }
    
    public List<Bike> getOwnerBikes(Long ownerId) {
        return bikeRepository.findByOwnerId(ownerId);
    }
    
    public Bike updateBike(Long id, Bike bikeDetails) {
        Optional<Bike> bikeOpt = bikeRepository.findById(id);
        if (bikeOpt.isEmpty()) {
            throw new RuntimeException("Bike not found");
        }
        
        Bike bike = bikeOpt.get();
        bike.setBrand(bikeDetails.getBrand());
        bike.setModel(bikeDetails.getModel());
        bike.setYear(bikeDetails.getYear());
        bike.setBikeType(bikeDetails.getBikeType());
        bike.setHourlyPrice(bikeDetails.getHourlyPrice());
        bike.setDescription(bikeDetails.getDescription());
        bike.setLocation(bikeDetails.getLocation());
        bike.setLatitude(bikeDetails.getLatitude());
        bike.setLongitude(bikeDetails.getLongitude());
        bike.setUpdatedAt(LocalDateTime.now());
        
        return bikeRepository.save(bike);
    }
    
    public void deleteBike(Long id) {
        Optional<Bike> bikeOpt = bikeRepository.findById(id);
        if (bikeOpt.isPresent()) {
            bikeRepository.deleteById(id);
        } else {
            throw new RuntimeException("Bike not found");
        }
    }
    
    public Bike approveBike(Long id) {
        Optional<Bike> bikeOpt = bikeRepository.findById(id);
        if (bikeOpt.isEmpty()) {
            throw new RuntimeException("Bike not found");
        }
        
        Bike bike = bikeOpt.get();
        bike.setStatus("APPROVED");
        bike.setUpdatedAt(LocalDateTime.now());
        return bikeRepository.save(bike);
    }
    
    public Bike rejectBike(Long id) {
        Optional<Bike> bikeOpt = bikeRepository.findById(id);
        if (bikeOpt.isEmpty()) {
            throw new RuntimeException("Bike not found");
        }
        
        Bike bike = bikeOpt.get();
        bike.setStatus("REJECTED");
        bike.setUpdatedAt(LocalDateTime.now());
        return bikeRepository.save(bike);
    }
    
    public int updateBikeImagesByBrandModel(String brand, String model, String imageUrl) {
        List<Bike> bikes = bikeRepository.findByBrandAndModel(brand, model);
        for (Bike bike : bikes) {
            bike.setImageUrl1(imageUrl);
            bike.setImageUrl2(imageUrl);
            bike.setImageUrl3(imageUrl);
            bike.setUpdatedAt(LocalDateTime.now());
            bikeRepository.save(bike);
        }
        return bikes.size();
    }
}
