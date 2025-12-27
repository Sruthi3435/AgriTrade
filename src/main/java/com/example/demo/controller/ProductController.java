package com.example.demo.controller;

import com.example.demo.model.Product;

import com.example.demo.model.User;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.ProductRepository;

import com.example.demo.repository.UserRepository;

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


    public ProductController(ProductRepository productRepository,  UserRepository  userRepository,BidRepository bidRepository) {
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.userRepository=userRepository;
    }

    // ➤ Add new product
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product, Principal principal) {

        String email = principal.getName(); // token extracted automatically

        product.setFarmerEmail(email);
        product.setClosed(false);
        product.setBiddingStart(LocalDateTime.now());

        // DO NOT force expiry yet
         product.getBiddingEnd();

        productRepository.save(product);

        return ResponseEntity.ok("Product added!");
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
            map.put("biddingEnd", p.getBiddingEnd());
            map.put("closed", p.isClosed());
            map.put("highestBid", highestBid);

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }



}
