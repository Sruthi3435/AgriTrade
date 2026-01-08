package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;

import com.example.demo.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bid")
public class BidController {
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final BidRepository bidRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    public BidController(UserRepository userRepository,EmailService emailService,NotificationRepository notificationRepository, BidRepository bidRepository, ProductRepository productRepository,OrderRepository orderRepository) {
        this.bidRepository = bidRepository;
        this.notificationRepository = notificationRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/place/{productId}")
    public ResponseEntity<?> placeBid(
            @PathVariable Long productId,
            @RequestBody Bid bidRequest,
            Principal principal
    ) {
        String retailerEmail = principal.getName();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        double basePrice = product.getPrice();
        double bidAmount = bidRequest.getAmount();

        // ❌ 1️⃣ Reject if bid < base price
        if (bidAmount < basePrice) {
            return ResponseEntity.badRequest()
                    .body("Bid must be ≥ base price ₹" + basePrice);
        }

        // ❌ 2️⃣ Reject if already placed a bid
        if (bidRepository.existsByProductIdAndRetailerEmail(productId, retailerEmail)) {
            return ResponseEntity.badRequest()
                    .body("You have already placed a bid on this product.");
        }

        // ✔ SAVE BID
        Bid bid = new Bid();
        bid.setProductId(productId);
        bid.setRetailerEmail(retailerEmail);
        bid.setFarmerEmail(product.getFarmerEmail());
        bid.setAmount(bidAmount);
        bid.setCreatedAt(LocalDateTime.now());

        bidRepository.save(bid);

        // OPTIONAL → notify farmer
        Notification notification = new Notification();
        notification.setToEmail(product.getFarmerEmail());
        notification.setMessage("New bid placed: ₹" + bidAmount + " on product: " + product.getName());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        return ResponseEntity.ok("Bid placed successfully!");
    }



    @GetMapping("/product/{productId}/bids")
    public ResponseEntity<?> getBids(@PathVariable Long productId, Principal principal) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmerEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        List<Bid> bids = bidRepository.findByProductId(productId);

        // transform to DTO with retailer name
        List<Map<String, Object>> response = bids.stream().map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", b.getId());  // <-- ADD THIS
            m.put("amount", b.getAmount());
            m.put("retailerEmail", b.getRetailerEmail());
            m.put("createdAt", b.getCreatedAt());

            String name = userRepository.findByEmail(b.getRetailerEmail())
                    .map(User::getName)
                    .orElse("Unknown Retailer");

            m.put("retailerName", name);

            return m;
        }).toList();


        return ResponseEntity.ok(response);
    }
    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId, Principal principal) {

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        Product product = productRepository.findById(bid.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // authorization
        if (!product.getFarmerEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        // mark bid accepted
        bid.setAccepted(true);
        bidRepository.save(bid);

        // UPDATE PRODUCT → THIS WAS MISSING ❗
        product.setClosed(true);
        product.setBiddingEnd(LocalDateTime.now());
        productRepository.save(product);

        // notify retailer
        Notification notification = new Notification();
        notification.setToEmail(bid.getRetailerEmail());
        notification.setMessage("Your bid on product '" + product.getName() + "' was accepted!");
        notificationRepository.save(notification);

        emailService.sendBidAcceptedEmail(
                bid.getRetailerEmail(),
                product.getName(),
                bid.getAmount()
        );

        // create order
        Order order = new Order();
        order.setProductId(product.getId());
        order.setFarmerEmail(product.getFarmerEmail());
        order.setRetailerEmail(bid.getRetailerEmail());
        order.setFinalPrice(bid.getAmount());

        // testing mode
        order.setOrderStatus("CONFIRMED");


        orderRepository.save(order);

        return ResponseEntity.ok("Bid accepted and notification sent.");
    }

    @GetMapping("/highest/{productId}")
    public ResponseEntity<?> getHighestBid(@PathVariable Long productId) {
        Double maxBid = bidRepository.findHighestBidForProduct(productId);
        return ResponseEntity.ok(maxBid == null ? 0 : maxBid);
    }

    @GetMapping("/notifications")
    public List<Notification> retailerNotifs(Principal principal) {
        return notificationRepository.findByToEmail(principal.getName());
    }


    @GetMapping("/accepted")
    public ResponseEntity<?> getAcceptedBids(Principal principal) {

        String email = principal.getName();

        List<Bid> bids = bidRepository.findByRetailerEmail(email);

        // filter only accepted (product closed)
        List<Map<String, Object>> response = bids.stream()
                .filter(b -> {
                    Product p = productRepository.findById(b.getProductId()).orElse(null);
                    return p != null && p.isClosed(); // accepted
                })
                .map(b -> {
                    Product p = productRepository.findById(b.getProductId()).orElse(null);
                    Map<String, Object> m = new HashMap<>();
                    assert p != null;
                    m.put("productName", p.getName());
                    m.put("amount", b.getAmount());
                    m.put("farmerEmail", b.getFarmerEmail());
                    return m;
                }).toList();

        return ResponseEntity.ok(response);

    }

    @PostMapping("/notifications/read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Principal principal) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!n.getToEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        n.setRead(true);
        notificationRepository.save(n);

        return ResponseEntity.ok("Marked read");
    }
    @GetMapping("/farmer/notifications")
    public List<Notification> farmerNotifs(Principal principal) {
        return notificationRepository.findByToEmail(principal.getName());
    }


    @PostMapping("/farmer/notifications/read/{id}")
    public ResponseEntity<?> markFarmerRead(@PathVariable Long id, Principal principal) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!n.getToEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).build();
        }

        n.setRead(true);
        notificationRepository.save(n);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/retailer")
    public ResponseEntity<?> getRetailerOrders(Principal principal) {

        List<Order> orders = orderRepository.findByRetailerEmail(principal.getName());

        List<Map<String, Object>> response = orders.stream().map(o -> {
            Map<String, Object> m = new HashMap<>();

            Product product = productRepository.findById(o.getProductId()).orElse(null);
            User farmer = userRepository.findByEmail(o.getFarmerEmail()).orElse(null);

            m.put("id", o.getId());
            m.put("finalPrice", o.getFinalPrice());
            m.put("orderStatus", o.getOrderStatus());
            m.put("deliveryStatus", o.getDeliveryStatus());
            m.put("createdAt", o.getCreatedAt());

            if (product != null) {
                m.put("productName", product.getName());
                m.put("image", product.getImages().split(",")[0]);
                m.put("quantity", product.getQuantity());
                m.put("unit", product.getUnit());
                m.put("location", product.getLocation());
            }

            if (farmer != null) {
                m.put("farmerName", farmer.getName());
                m.put("farmerEmail", farmer.getEmail());
            }

            return m;
        }).toList();

        return ResponseEntity.ok(response);
    }



}