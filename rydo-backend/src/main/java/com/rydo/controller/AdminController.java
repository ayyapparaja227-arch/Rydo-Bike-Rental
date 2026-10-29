package com.rydo.controller;

import com.rydo.entity.Bike;
import com.rydo.entity.User;
import com.rydo.service.AdminService;
import com.rydo.service.BikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private BikeService bikeService;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @GetMapping("/bikes/pending")
    public ResponseEntity<List<Bike>> getPendingBikes() {
        return ResponseEntity.ok(adminService.getPendingBikes());
    }
    
    @PutMapping("/bikes/{id}/approve")
    public ResponseEntity<?> approveBike(@PathVariable Long id) {
        try {
            Bike bike = bikeService.approveBike(id);
            return ResponseEntity.ok(bike);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/bikes/{id}/reject")
    public ResponseEntity<?> rejectBike(@PathVariable Long id) {
        try {
            Bike bike = bikeService.rejectBike(id);
            return ResponseEntity.ok(bike);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleUserBan(@PathVariable Long id) {
        try {
            User user = adminService.toggleUserBan(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
