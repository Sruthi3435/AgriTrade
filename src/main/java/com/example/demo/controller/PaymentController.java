package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final OrderRepository orderRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${cashfree.app-id}")
    private String appId;

    @Value("${cashfree.secret-key}")
    private String secretKey;

    @Value("${cashfree.base-url}")
    private String baseUrl;

    public PaymentController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }




    // 1️⃣ CREATE CASHFREE ORDER
    @PostMapping("/create/{orderId}")
    public ResponseEntity<?> createPayment(@PathVariable Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ UNIQUE CASHFREE ORDER ID (MANDATORY)
        String cashfreeOrderId =
                "CF_" + orderId + "_" + System.currentTimeMillis();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", appId);
        headers.set("x-client-secret", secretKey);
        headers.set("x-api-version", "2022-09-01");

        Map<String, Object> payload = new HashMap<>();
        payload.put("order_id", cashfreeOrderId);
        payload.put("order_amount", order.getFinalPrice());
        payload.put("order_currency", "INR");
        payload.put("order_note", "AgroLink Order Payment");

        Map<String, Object> customer = new HashMap<>();
        customer.put("customer_id", "retailer_" + order.getId());
        customer.put("customer_email", order.getRetailerEmail());
        customer.put("customer_phone", "9999999999");
        payload.put("customer_details", customer);

        Map<String, String> orderMeta = new HashMap<>();
        orderMeta.put(
                "return_url",
                "http://localhost:5173/retailer/orders?order_id={order_id}"
        );
        payload.put("order_meta", orderMeta);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/orders",
                request,
                String.class
        );

        // ✅ SAVE CASHFREE DETAILS
        order.setCashfreeOrderId(cashfreeOrderId);
        order.setPaymentStatus("CREATED");
        orderRepo.save(order);

        return ResponseEntity.ok(response.getBody());
    }
    @GetMapping("/verify/by-cashfree/{cfOrderId}")
    public ResponseEntity<?> verify(@PathVariable String cfOrderId) {

        Order order = orderRepo.findByCashfreeOrderId(cfOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-client-id", appId);
        headers.set("x-client-secret", secretKey);
        headers.set("x-api-version", "2022-09-01");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/orders/" + cfOrderId,
                HttpMethod.GET,
                entity,
                Map.class
        );
        System.out.println("Cashfree response = " + response.getBody());
        String orderStatus = (String) response.getBody().get("order_status");




        if ("PAID".equals(orderStatus)) {
            order.setPaymentStatus("PAID");
            order.setPaidAt(LocalDateTime.now());
            order.setDeliveryStatus("READY");
            orderRepo.save(order);
        }

        return ResponseEntity.ok("Payment verified");
    }

    @GetMapping("/mark-paid/{orderId}")
    public ResponseEntity<?> markPaid(@PathVariable Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus("PAID");
        order.setPaidAt(LocalDateTime.now());
        orderRepo.save(order);

        return ResponseEntity.ok("Marked PAID");
    }




}

