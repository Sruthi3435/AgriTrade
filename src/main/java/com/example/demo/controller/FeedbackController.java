package com.example.demo.controller;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.model.Feedback;
import com.example.demo.service.FeedbackService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /* ================= RETAILER → SUBMIT ================= */
    @PostMapping("/submit/{orderId}")
    public void submitFeedback(
            @PathVariable Long orderId,
            @RequestBody FeedbackRequest request,
            Authentication authentication
    ) {
        feedbackService.submitFeedback(
                orderId,
                request,
                authentication.getName()
        );
    }

    /* ================= FARMER → VIEW ================= */
    @GetMapping("/farmer")
    public List<Feedback> getFarmerFeedback(Authentication authentication) {
        return feedbackService.getFeedbackForFarmer(
                authentication.getName()
        );
    }
}
