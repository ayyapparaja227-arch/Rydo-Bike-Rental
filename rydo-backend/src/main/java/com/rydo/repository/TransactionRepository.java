package com.rydo.repository;

import com.rydo.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBookingId(Long bookingId);
    List<Transaction> findByRenterId(Long renterId);
    List<Transaction> findByOwnerId(Long ownerId);
    List<Transaction> findByPaymentStatus(String status);
    
    @Query("SELECT SUM(t.platformFee) FROM Transaction t WHERE t.paymentStatus = 'SUCCESS'")
    Double calculateTotalPlatformRevenue();
}
