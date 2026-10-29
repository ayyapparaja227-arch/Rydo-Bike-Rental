package com.rydo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

@Service
public class SmsService {
    
    @Value("${sms.fast2sms.api-key:demo}")
    private String apiKey;
    
    @Value("${sms.fast2sms.sender-id:RYDO}")
    private String senderId;
    
    // Store OTPs in memory (use Redis in production)
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    
    private static class OtpData {
        String otp;
        LocalDateTime expiresAt;
        
        OtpData(String otp, int expiryMinutes) {
            this.otp = otp;
            this.expiresAt = LocalDateTime.now().plusMinutes(expiryMinutes);
        }
        
        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }
    
    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    
    public Map<String, Object> sendOtp(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        
        // Clean phone number (remove +91 or other prefixes)
        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() == 12) {
            cleanPhone = cleanPhone.substring(2);
        }
        
        String otp = generateOtp();
        
        // Store OTP with 5-minute expiry
        otpStore.put(cleanPhone, new OtpData(otp, 5));
        
        // Log API key status (first 10 chars only for security)
        String keyPreview = apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : apiKey;
        System.out.println("Fast2SMS API Key: " + keyPreview);
        
        // Check if API key is set
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("demo") || apiKey.equals("YOUR_FAST2SMS_API_KEY")) {
            // Demo mode - just log the OTP
            System.out.println("====================================");
            System.out.println("📱 SMS OTP (Demo Mode)");
            System.out.println("Phone: " + cleanPhone);
            System.out.println("OTP: " + otp);
            System.out.println("====================================");
            
            response.put("success", true);
            response.put("message", "OTP sent successfully (Demo mode - check server console)");
            response.put("demoOtp", otp); // Only in demo mode
            return response;
        }
        
        try {
            // Fast2SMS API call
            RestTemplate restTemplate = new RestTemplate();
            
            // Try Quick Transactional route (doesn't need DLT)
            String url = "https://www.fast2sms.com/dev/bulkV2";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> body = new HashMap<>();
            body.put("route", "q"); // Quick transactional route
            body.put("message", "Your Rydo OTP is " + otp + ". Valid for 5 minutes.");
            body.put("language", "english");
            body.put("flash", 0);
            body.put("numbers", cleanPhone);
            
            System.out.println("Sending SMS to: " + cleanPhone);
            System.out.println("Message: Your Rydo OTP is " + otp);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> apiResponse = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            
            if (apiResponse.getStatusCode().is2xxSuccessful()) {
                response.put("success", true);
                response.put("message", "OTP sent to " + maskPhone(cleanPhone));
            } else {
                response.put("success", false);
                response.put("message", "Failed to send OTP");
            }
            
        } catch (Exception e) {
            System.err.println("SMS Error: " + e.getMessage());
            // Fallback to demo mode
            response.put("success", true);
            response.put("message", "OTP sent (Demo mode)");
            response.put("demoOtp", otp);
        }
        
        return response;
    }
    
    public Map<String, Object> verifyOtp(String phoneNumber, String otp) {
        Map<String, Object> response = new HashMap<>();
        
        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() == 12) {
            cleanPhone = cleanPhone.substring(2);
        }
        
        OtpData storedOtp = otpStore.get(cleanPhone);
        
        if (storedOtp == null) {
            response.put("success", false);
            response.put("message", "No OTP found. Please request a new one.");
            return response;
        }
        
        if (storedOtp.isExpired()) {
            otpStore.remove(cleanPhone);
            response.put("success", false);
            response.put("message", "OTP expired. Please request a new one.");
            return response;
        }
        
        if (storedOtp.otp.equals(otp)) {
            otpStore.remove(cleanPhone);
            response.put("success", true);
            response.put("message", "Phone number verified successfully!");
            return response;
        }
        
        response.put("success", false);
        response.put("message", "Invalid OTP. Please try again.");
        return response;
    }
    
    private String maskPhone(String phone) {
        if (phone.length() >= 10) {
            return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 4);
        }
        return phone;
    }
}
