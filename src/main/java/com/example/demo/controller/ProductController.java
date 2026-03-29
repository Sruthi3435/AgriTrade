package com.example.demo.controller;

import com.example.demo.model.*;

import com.example.demo.repository.BidRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;

import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    private final BidRepository bidRepository;
private final UserRepository userRepository;
    private final ProductRepository productRepository;
private final OrderRepository orderRepository;

    public ProductController(ProductRepository productRepository,  UserRepository  userRepository,OrderRepository orderRepository,BidRepository bidRepository) {
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.userRepository=userRepository;
        this.orderRepository=orderRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product, Principal principal) {

        product.setFarmerEmail(principal.getName());
        product.setStatus(ProductStatus.ACTIVE);

        if (product.getTradeType() == TradeType.AUCTION) {

            if (product.getBiddingEnd() == null) {
                return ResponseEntity.badRequest()
                        .body("Bidding end time required for auction");
            }

            product.setBiddingStart(LocalDateTime.now());

        } else {
            // DIRECT TRADE
            product.setBiddingStart(null);
            product.setBiddingEnd(null);
        }

        productRepository.save(product);
        return ResponseEntity.ok("Product added");
    }

    @GetMapping("/active")
    public List<Map<String, Object>> getActiveProducts() {

        List<Product> products = productRepository.findByClosedFalse();

        return products.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();

            m.put("id", p.getId());
            m.put("name", p.getName());
            m.put("category", p.getCategory());
            m.put("quantity", p.getQuantity());
            m.put("unit", p.getUnit());
            m.put("price", p.getPrice());
            m.put("location", p.getLocation());
            m.put("trade_type", p.getTradeType().name());
            m.put("biddingEnd", p.getBiddingEnd());
            m.put("images", p.getImages());
            m.put("farmerEmail", p.getFarmerEmail());

            // ⭐ ADD FARMER NAME HERE
            User farmer = userRepository.findByEmail(p.getFarmerEmail()).orElse(null);
            m.put("farmerName", farmer != null ? farmer.getName() : "Unknown");
            m.put("status", p.isClosed() ? "SOLD" : "ACTIVE");

            return m;
        }).toList();
    }


    // ➤ My Listings for Farmer
    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts(Principal principal) {

        String email = principal.getName();
        List<Product> list = productRepository.findByFarmerEmail(email);

        List<Map<String, Object>> response = new ArrayList<>();

        for (Product p : list) {

            Double highestBid = bidRepository.findMaxBidByProductId(p.getId());
            if (highestBid == null) highestBid = 0.0;

            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("price", p.getPrice());
            map.put("unit", p.getUnit());
            map.put("location", p.getLocation());
            map.put("images", p.getImages());
            map.put("tradeType", p.getTradeType().name());

            map.put("biddingEnd", p.getBiddingEnd());
            map.put("closed", p.isClosed());
            map.put("highestBid", highestBid);

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }



}
