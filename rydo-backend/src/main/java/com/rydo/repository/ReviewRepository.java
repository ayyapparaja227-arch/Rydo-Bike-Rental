package com.rydo.repository;

import com.rydo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBikeId(Long bikeId);
    List<Review> findByReviewedUserId(Long userId);
    List<Review> findByReviewerId(Long reviewerId);
    List<Review> findByReviewType(String reviewType);
}
