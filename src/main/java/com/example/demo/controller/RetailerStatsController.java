package com.example.demo.controller;

import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/retailer")
@CrossOrigin
public class RetailerStatsController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public RetailerStatsController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getRetailerStats(Principal principal) {

        String email = principal.getName();

        // 1. Total Orders
        int totalOrders = orderRepository.countByRetailerEmail(email);

        // 2. Pending Orders
        int pendingOrders = orderRepository.countByRetailerEmailAndDeliveryStatus(email, "PENDING");

        // 3. Total Spending
        Double totalSpending = orderRepository.sumFinalPriceByRetailerEmail(email);
        if (totalSpending == null) totalSpending = 0.0;

        // 4. Recent 5 Orders
        var recent = orderRepository.findTop5ByRetailerEmailOrderByCreatedAtDesc(email);

        // 5. Orders Per Month Chart
        List<Object[]> monthly = orderRepository.countOrdersPerMonthForRetailer(email);

        // 6. Spending Per Month Chart
        List<Object[]> spending = orderRepository.spendingPerMonth(email);


        Map<String, Object> map = new HashMap<>();
        map.put("totalOrders", totalOrders);
        map.put("pendingOrders", pendingOrders);
        map.put("totalSpending", totalSpending);
        map.put("recentOrders", recent);
        map.put("ordersPerMonth", monthly);
        map.put("spendingPerMonth", spending);

        return ResponseEntity.ok(map);
    }
}
