package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OrderController(OrderRepository orderRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /* ============================================================
       1️⃣ GET RETAILER ORDERS
       API -> /api/orders/retailer
       ============================================================ */
    @GetMapping("/retailer")
    public ResponseEntity<?> getRetailerOrders(@RequestHeader("Authorization") String token) {

        String retailerEmail = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        List<Order> orders = orderRepository.findByRetailerEmail(retailerEmail);

        List<Map<String, Object>> response = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();

            // Base fields
            map.put("id", order.getId());
            map.put("finalPrice", order.getFinalPrice());
            map.put("deliveryStatus", order.getDeliveryStatus());
            map.put("orderStatus", order.getOrderStatus());
            map.put("createdAt", order.getCreatedAt());

            // Product details
            Product product = productRepository.findById(order.getProductId()).orElse(null);
            if (product != null) {
                map.put("productName", product.getName());
                map.put("quantity", product.getQuantity());
                map.put("unit", product.getUnit());
                map.put("location", product.getLocation());
                map.put("image", product.getImages());
            }

            // Farmer details
            User farmer = userRepository.findByEmail(order.getFarmerEmail()).orElse(null);
            map.put("farmerName", farmer != null ? farmer.getName() : "Unknown");
            map.put("farmerEmail", order.getFarmerEmail());

            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }



    /* ============================================================
       2️⃣ GET FARMER ORDERS
       API -> /api/orders/farmer
       ============================================================ */
    @GetMapping("/farmer")
    public ResponseEntity<?> getFarmerOrders(Principal principal) {

        String farmerEmail = principal.getName();
        List<Order> orders = orderRepository.findByFarmerEmail(farmerEmail);

        List<Map<String, Object>> response = orders.stream().map(order -> {
            Map<String, Object> m = new HashMap<>();

            Product product = productRepository.findById(order.getProductId()).orElse(null);

            m.put("id", order.getId());
            m.put("productName", product != null ? product.getName() : "Unknown Product");
            m.put("image", product != null ? product.getImages() : null);
            m.put("quantity", product != null ? product.getQuantity() : null);
            m.put("unit", product != null ? product.getUnit() : null);
            m.put("location", product != null ? product.getLocation() : null);

            User farmer = userRepository.findByEmail(order.getFarmerEmail()).orElse(null);
            m.put("farmerName", farmer != null ? farmer.getName() : "Unknown Farmer");
            m.put("farmerEmail", order.getFarmerEmail());

            User retailer = userRepository.findByEmail(order.getRetailerEmail()).orElse(null);
            m.put("retailerName", retailer != null ? retailer.getName() : "Unknown Retailer");

            m.put("finalPrice", order.getFinalPrice());
            m.put("deliveryStatus", order.getDeliveryStatus());
            m.put("createdAt", order.getCreatedAt());

            return m;
        }).toList();

        return ResponseEntity.ok(response);
    }


    /* ============================================================
       3️⃣ UPDATE DELIVERY STATUS
       API -> /api/orders/update-delivery/{id}?deliveryStatus=DELIVERED
       ============================================================ */
    @PutMapping("/update-delivery/{id}")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestParam String deliveryStatus,
            Principal principal
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Only farmer can update delivery
        if (!order.getFarmerEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        order.setDeliveryStatus(deliveryStatus);
        orderRepository.save(order);

        return ResponseEntity.ok("Delivery updated to " + deliveryStatus);
    }


    /* ============================================================
       4️⃣ GET INVOICE
       API -> /api/orders/invoice/{id}
       ============================================================ */
    @GetMapping("/invoice/{id}")
    public ResponseEntity<?> getInvoice(@PathVariable Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Product product = productRepository.findById(order.getProductId()).orElse(null);
        User farmer = userRepository.findByEmail(order.getFarmerEmail()).orElse(null);
        User retailer = userRepository.findByEmail(order.getRetailerEmail()).orElse(null);

        Map<String, Object> invoice = new HashMap<>();

        invoice.put("orderId", order.getId());
        invoice.put("date", order.getCreatedAt());
        invoice.put("product", product != null ? product.getName() : "Unknown Product");
        invoice.put("quantity", product != null ? product.getQuantity() : null);
        invoice.put("unit", product != null ? product.getUnit() : null);
        invoice.put("productImage", product != null ? product.getImages() : null);

        invoice.put("farmerName", farmer != null ? farmer.getName() : null);
        invoice.put("farmerEmail", order.getFarmerEmail());

        invoice.put("retailerName", retailer != null ? retailer.getName() : null);
        invoice.put("retailerEmail", order.getRetailerEmail());

        invoice.put("finalPrice", order.getFinalPrice());

        return ResponseEntity.ok(invoice);
    }

}
