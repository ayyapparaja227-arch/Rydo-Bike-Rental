package com.rydo.repository;

import com.rydo.entity.SafetyCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SafetyCheckRepository extends JpaRepository<SafetyCheck, Long> {
    List<SafetyCheck> findByBookingId(Long bookingId);
    List<SafetyCheck> findByBikeId(Long bikeId);
    Optional<SafetyCheck> findByBookingIdAndCheckType(Long bookingId, String checkType);
}
