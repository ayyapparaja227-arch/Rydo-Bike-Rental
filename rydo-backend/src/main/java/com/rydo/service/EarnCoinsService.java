package com.rydo.service;

import com.rydo.entity.Booking;
import com.rydo.entity.User;
import com.rydo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class EarnCoinsService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Award EarnCoins to both renter and owner after completed booking
     * Gamification system to encourage platform usage
     */
    public int awardCoinsForBooking(Booking booking) {
        // Calculate coins based on booking value
        int coinsForOwner = (int) (booking.getTotalPrice() / 10); // 1 coin per ₹10
        int coinsForRenter = booking.getHours() * 5; // 5 coins per hour rented
        
        // Award to owner
        awardCoins(booking.getOwnerId(), coinsForOwner);
        
        // Award to renter
        awardCoins(booking.getRenterId(), coinsForRenter);
        
        return coinsForRenter;
    }
    
    /**
     * Award coins to a user
     */
    public void awardCoins(Long userId, int coins) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEarnCoins(user.getEarnCoins() + coins);
            userRepository.save(user);
        }
    }
    
    /**
     * Deduct coins from user (for listing boost, discounts, etc.)
     */
    public boolean spendCoins(Long userId, int coins) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        if (user.getEarnCoins() < coins) {
            return false; // Insufficient coins
        }
        
        user.setEarnCoins(user.getEarnCoins() - coins);
        userRepository.save(user);
        return true;
    }
    
    /**
     * Get coin balance
     */
    public int getCoinBalance(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(User::getEarnCoins).orElse(0);
    }
    
    /**
     * Award early adopter bonus
     */
    public void awardEarlyAdopterBonus(Long userId, int bonus) {
        awardCoins(userId, bonus);
    }
}
