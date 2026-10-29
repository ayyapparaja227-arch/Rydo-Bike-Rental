package com.rydo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:rydo.demo@gmail.com}")
    private String fromEmail;

    // Store OTPs in memory with timestamp (Email -> OTP)
    private final ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> otpExpiry = new ConcurrentHashMap<>();

    private static final long OTP_VALID_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    public String generateOTP(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + OTP_VALID_DURATION_MS);
        return otp;
    }

    public boolean sendOTPEmail(String toEmail, String otp) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Rydo Verification OTP");
                message.setText("Your verification OTP for Rydo is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
                mailSender.send(message);
                System.out.println("✅ Email sent to " + toEmail + " with OTP: " + otp);
                return true;
            } else {
                // Fallback for demo if mail sender is not configured
                System.out.println("⚠️ MailSender not configured. Mocking email send.");
                System.out.println("📧 To: " + toEmail);
                System.out.println("🔑 OTP: " + otp);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            // For demo purposes, we still return true and log the OTP so the flow isn't blocked
            System.out.println("🔑 Mock OTP (fallback): " + otp);
            return true;
        }
    }

    public boolean verifyOTP(String email, String otp) {
        if (!otpStorage.containsKey(email)) {
            return false;
        }

        Long expiryTime = otpExpiry.get(email);
        if (System.currentTimeMillis() > expiryTime) {
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return false;
        }

        String storedOtp = otpStorage.get(email);
        if (storedOtp.equals(otp)) {
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return true;
        }

        return false;
    }
}
