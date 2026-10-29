package com.rydo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaymentController {
    
    /**
     * Mock payment simulation for demo
     * In production, integrate with Razorpay, Stripe, etc.
     */
    @PostMapping("/simulate")
    public ResponseEntity<?> simulatePayment(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Double amount = ((Number) request.get("amount")).doubleValue();
            String method = (String) request.getOrDefault("method", "UPI");
            
            // Simulate payment processing
            Thread.sleep(1000); // Simulate network delay
            
            response.put("success", true);
            response.put("transactionId", "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            response.put("amount", amount);
            response.put("method", method);
            response.put("status", "SUCCESS");
            response.put("message", "Payment successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Payment failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
