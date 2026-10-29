package com.rydo.service;

import com.rydo.entity.Review;
import com.rydo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    /**
     * Create a review
     */
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        review.setHelpfulCount(0);
        return reviewRepository.save(review);
    }
    
    /**
     * Get reviews for a bike
     */
    public List<Review> getBikeReviews(Long bikeId) {
        return reviewRepository.findByBikeId(bikeId);
    }
    
    /**
     * Get reviews for a user
     */
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }
}
