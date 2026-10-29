package com.rydo.service;

import com.rydo.dto.SlotRequest;
import com.rydo.entity.AvailabilitySlot;
import com.rydo.repository.AvailabilitySlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvailabilityService {
    
    @Autowired
    private AvailabilitySlotRepository slotRepository;
    
    /**
     * Create availability slots for a bike
     * This is the CORE of the time-slice availability engine
     */
    public AvailabilitySlot createSlot(SlotRequest request) {
        // Check for conflicting slots
        List<AvailabilitySlot> conflicts = slotRepository.findConflictingSlots(
            request.getBikeId(), 
            request.getStartTime(), 
            request.getEndTime()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Slot conflicts with existing availability");
        }
        
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setBikeId(request.getBikeId());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setStatus("AVAILABLE");
        slot.setCreatedAt(LocalDateTime.now());
        
        return slotRepository.save(slot);
    }
    
    /**
     * Get all slots for a bike
     */
    public List<AvailabilitySlot> getSlotsByBikeId(Long bikeId) {
        return slotRepository.findByBikeId(bikeId);
    }
    
    /**
     * Get available slots for a bike in a time range
     */
    public List<AvailabilitySlot> getAvailableSlots(Long bikeId, LocalDateTime start, LocalDateTime end) {
        return slotRepository.findAvailableSlotsBetween(bikeId, start, end);
    }
    
    /**
     * Mark slots as booked (called by BookingService)
     */
    public void markSlotsAsBooked(Long bikeId, LocalDateTime start, LocalDateTime end, Long bookingId) {
        List<AvailabilitySlot> slots = slotRepository.findAvailableSlotsBetween(bikeId, start, end);
        
        for (AvailabilitySlot slot : slots) {
            slot.setStatus("BOOKED");
            slot.setBookingId(bookingId);
            slot.setUpdatedAt(LocalDateTime.now());
            slotRepository.save(slot);
        }
    }
    
    /**
     * Release slots when booking is cancelled
     */
    public void releaseSlotsFromBooking(Long bookingId) {
        List<AvailabilitySlot> slots = slotRepository.findAll().stream()
            .filter(s -> bookingId.equals(s.getBookingId()))
            .toList();
        
        for (AvailabilitySlot slot : slots) {
            slot.setStatus("AVAILABLE");
            slot.setBookingId(null);
            slot.setUpdatedAt(LocalDateTime.now());
            slotRepository.save(slot);
        }
    }
    
    /**
     * Delete a slot
     */
    public void deleteSlot(Long slotId) {
        slotRepository.deleteById(slotId);
    }
}
