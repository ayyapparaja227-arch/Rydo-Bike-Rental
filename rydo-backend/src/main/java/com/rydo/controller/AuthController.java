package com.rydo.controller;

import com.rydo.dto.LoginRequest;
import com.rydo.dto.RegisterRequest;
import com.rydo.entity.User;
import com.rydo.repository.UserRepository;
import com.rydo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Map<String, Object> response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @Autowired
    private com.rydo.service.EmailService emailService;
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required"));
        }
        
        String otp = emailService.generateOTP(email);
        boolean sent = emailService.sendOTPEmail(email, otp);
        
        if (sent) {
            return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent successfully"));
        } else {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Failed to send OTP"));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email and OTP are required"));
        }
        
        boolean verified = emailService.verifyOTP(email, otp);
        
        if (verified) {
            return ResponseEntity.ok(Map.of("success", true, "message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired OTP"));
        }
    }
    
    @Autowired
    private com.rydo.service.SmsService smsService;
    
    @PostMapping("/send-sms-otp")
    public ResponseEntity<?> sendSmsOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        if (phone == null || phone.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Phone number is required"));
        }
        
        Map<String, Object> response = smsService.sendOtp(phone);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify-sms-otp")
    public ResponseEntity<?> verifySmsOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String otp = request.get("otp");
        
        if (phone == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Phone and OTP are required"));
        }
        
        Map<String, Object> response = smsService.verifyOtp(phone, otp);
        if ((boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
