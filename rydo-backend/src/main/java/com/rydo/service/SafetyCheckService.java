package com.rydo.service;

import com.rydo.entity.SafetyCheck;
import com.rydo.repository.SafetyCheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class SafetyCheckService {
    
    @Autowired
    private SafetyCheckRepository safetyCheckRepository;
    
    /**
     * Perform RideGuard safety check (mock AI analysis)
     * In production, this would call actual AI/ML model
     */
    public SafetyCheck performSafetyCheck(Long bookingId, Long bikeId, Long userId, String videoUrl) {
        SafetyCheck check = new SafetyCheck();
        check.setBookingId(bookingId);
        check.setBikeId(bikeId);
        check.setUserId(userId);
        check.setVideoUrl(videoUrl);
        check.setCheckType("PRE_RIDE");
        check.setCreatedAt(LocalDateTime.now());
        
        // Mock AI analysis
        Map<String, Object> aiResult = performMockAIAnalysis();
        
        check.setAiAnalysis(aiResult.toString());
        check.setScratchesDetected((Boolean) aiResult.get("scratches"));
        check.setDentsDetected((Boolean) aiResult.get("dents"));
        check.setTyreConditionGood((Boolean) aiResult.get("tyreGood"));
        check.setMirrorConditionGood((Boolean) aiResult.get("mirrorGood"));
        check.setSafetyScore((Double) aiResult.get("safetyScore"));
        
        return safetyCheckRepository.save(check);
    }
    
    /**
     * Mock AI analysis for demo
     * In production, would integrate with actual computer vision model
     */
    private Map<String, Object> performMockAIAnalysis() {
        Map<String, Object> result = new HashMap<>();
        
        // Generate random but realistic results
        boolean scratches = Math.random() < 0.2; // 20% chance
        boolean dents = Math.random() < 0.1; // 10% chance
        boolean tyreGood = Math.random() < 0.9; // 90% good
        boolean mirrorGood = Math.random() < 0.95; // 95% good
        
        double safetyScore = 100.0;
        if (scratches) safetyScore -= 15;
        if (dents) safetyScore -= 25;
        if (!tyreGood) safetyScore -= 30;
        if (!mirrorGood) safetyScore -= 10;
        
        result.put("scratches", scratches);
        result.put("dents", dents);
        result.put("tyreGood", tyreGood);
        result.put("mirrorGood", mirrorGood);
        result.put("safetyScore", safetyScore);
        result.put("analysis", "AI analysis completed");
        
        return result;
    }
}
