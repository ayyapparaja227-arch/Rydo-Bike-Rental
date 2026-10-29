package com.rydo.controller;

import com.rydo.entity.Bike;
import com.rydo.service.BikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BikeController {
    
    @Autowired
    private BikeService bikeService;
    
    @PostMapping
    public ResponseEntity<?> createBike(@RequestBody Bike bike) {
        try {
            Bike created = bikeService.createBike(bike);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Bike>> getAllBikes(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String bikeType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        if (location != null || bikeType != null || minPrice != null || maxPrice != null) {
            return ResponseEntity.ok(bikeService.searchBikes(location, bikeType, minPrice, maxPrice));
        }
        return ResponseEntity.ok(bikeService.getAllBikes());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBikeById(@PathVariable Long id) {
        Optional<Bike> bike = bikeService.getBikeById(id);
        return bike.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<Bike>> getFeaturedBikes() {
        return ResponseEntity.ok(bikeService.getFeaturedBikes());
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Bike>> getOwnerBikes(@PathVariable Long ownerId) {
        return ResponseEntity.ok(bikeService.getOwnerBikes(ownerId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBike(@PathVariable Long id, @RequestBody Bike bike) {
        try {
            Bike updated = bikeService.updateBike(id, bike);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(@PathVariable Long id) {
        try {
            bikeService.deleteBike(id);
            return ResponseEntity.ok("Bike deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/update-image")
    public ResponseEntity<?> updateBikeImages(
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam String imageUrl
    ) {
        try {
            int updatedCount = bikeService.updateBikeImagesByBrandModel(brand, model, imageUrl);
            return ResponseEntity.ok("Updated " + updatedCount + " bike(s) with new image");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
