package com.rydo.repository;

import com.rydo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRenterId(Long renterId);
    List<Booking> findByBikeId(Long bikeId);
    List<Booking> findByOwnerId(Long ownerId);
    List<Booking> findByStatus(String status);
    
    @Query("SELECT b FROM Booking b WHERE b.renterId = :renterId " +
           "AND b.status IN ('CONFIRMED', 'ACTIVE')")
    List<Booking> findActiveBookingsByRenter(@Param("renterId") Long renterId);
    
    @Query("SELECT b FROM Booking b WHERE b.ownerId = :ownerId " +
           "AND b.status = 'PENDING'")
    List<Booking> findPendingBookingsByOwner(@Param("ownerId") Long ownerId);
    
    @Query("SELECT SUM(b.totalPrice - b.platformFee) FROM Booking b " +
           "WHERE b.ownerId = :ownerId AND b.status = 'COMPLETED'")
    Double calculateTotalEarnings(@Param("ownerId") Long ownerId);
}
