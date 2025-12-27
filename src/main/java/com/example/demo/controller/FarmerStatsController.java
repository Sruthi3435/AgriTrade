package com.example.demo.controller;

import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/farmer")
@CrossOrigin
public class FarmerStatsController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public FarmerStatsController(ProductRepository productRepository,
                                 OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Principal principal) {

        String farmerEmail = principal.getName();  // Logged-in farmer email

        int totalListings = productRepository.countByFarmerEmail(farmerEmail);
        int activeListings = productRepository.countByFarmerEmailAndClosedFalse(farmerEmail);
        Double totalSales = orderRepository.sumFinalPriceByFarmerEmail(farmerEmail);
        int pendingOrders = orderRepository.countByFarmerEmailAndDeliveryStatus(farmerEmail, "PENDING");

        Map<String, Object> map = new HashMap<>();
        map.put("totalListings", totalListings);
        map.put("activeListings", activeListings);
        map.put("totalSales", totalSales == null ? 0 : totalSales);
        map.put("pendingOrders", pendingOrders);

        return ResponseEntity.ok(map);
    }
}
