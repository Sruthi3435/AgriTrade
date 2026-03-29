package com.example.demo.service;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.model.Feedback;
import com.example.demo.model.Order;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final OrderRepository orderRepo;

    public FeedbackService(FeedbackRepository feedbackRepo,
                           OrderRepository orderRepo) {
        this.feedbackRepo = feedbackRepo;
        this.orderRepo = orderRepo;
    }

    /* ================= SUBMIT FEEDBACK ================= */
    public void submitFeedback(Long orderId,
                               FeedbackRequest request,
                               String retailerEmail) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getRetailerEmail().equals(retailerEmail)) {
            throw new RuntimeException("Unauthorized feedback attempt");
        }

        if (!"DELIVERED".equals(order.getDeliveryStatus())) {
            throw new RuntimeException("Feedback allowed only after delivery");
        }

        if (feedbackRepo.existsByOrderId(orderId)) {
            throw new RuntimeException("Feedback already submitted");
        }

        Feedback feedback = new Feedback();
        feedback.setOrderId(order.getId());
        feedback.setProductId(order.getProductId());
        feedback.setFarmerEmail(order.getFarmerEmail());
        feedback.setRetailerEmail(order.getRetailerEmail());
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        feedbackRepo.save(feedback);
    }

    /* ================= FARMER DASHBOARD ================= */
    public List<Feedback> getFeedbackForFarmer(String farmerEmail) {
        return feedbackRepo.findByFarmerEmail(farmerEmail);
    }
}
