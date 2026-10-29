package com.rydo.repository;

import com.rydo.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByBikeId(Long bikeId);
    List<AvailabilitySlot> findByBikeIdAndStatus(Long bikeId, String status);
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.bikeId = :bikeId " +
           "AND a.status = 'AVAILABLE' " +
           "AND a.startTime >= :startTime AND a.endTime <= :endTime")
    List<AvailabilitySlot> findAvailableSlotsBetween(
        @Param("bikeId") Long bikeId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.bikeId = :bikeId " +
           "AND a.status != 'BLOCKED' " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    List<AvailabilitySlot> findConflictingSlots(
        @Param("bikeId") Long bikeId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}
