package com.rydo.controller;

import com.rydo.dto.SlotRequest;
import com.rydo.entity.AvailabilitySlot;
import com.rydo.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AvailabilityController {
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @PostMapping("/slots")
    public ResponseEntity<?> createSlot(@RequestBody SlotRequest request) {
        try {
            AvailabilitySlot slot = availabilityService.createSlot(request);
            return ResponseEntity.ok(slot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/bike/{bikeId}")
    public ResponseEntity<List<AvailabilitySlot>> getBikeSlots(@PathVariable Long bikeId) {
        return ResponseEntity.ok(availabilityService.getSlotsByBikeId(bikeId));
    }
    
    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId) {
        try {
            availabilityService.deleteSlot(slotId);
            return ResponseEntity.ok("Slot deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
