package com.rydo.service;

import com.rydo.dto.LoginRequest;
import com.rydo.dto.RegisterRequest;
import com.rydo.entity.User;
import com.rydo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, hash the password
        user.setPhone(request.getPhone());
        user.setRole("USER");
        user.setTrustScore(100.0);
        user.setEarnCoins(100); // Welcome bonus
        user.setVerified(true); // Auto-verify new users
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        User saved = userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", saved);
        
        return response;
    }
    
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        // Simple password check (in production, use proper password hashing)
        if (!user.getPassword().equals(request.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }
        
        if (!user.getActive()) {
            response.put("success", false);
            response.put("message", "Account is deactivated");
            return response;
        }
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", user);
        
        return response;
    }
}
