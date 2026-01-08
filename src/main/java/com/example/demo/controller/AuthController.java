package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.model.*;

import com.example.demo.repository.BidRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.scheduler.ProductScheduler;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.ProductRepository;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final BidRepository bidRepo;
    private final ProductScheduler productScheduler;
    private final OrderRepository orderRepository;
    public AuthController(UserService userService,BidRepository bidRepo,
                          ProductScheduler productScheduler,OrderRepository orderRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil,UserRepository userRepository,ProductRepository productRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.productRepository= productRepository;
        this.bidRepo = bidRepo;
        this.productScheduler= productScheduler;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/test")
    public String test() {
        return passwordEncoder.encode("Sruthi@123");
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @RequestParam String role,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String city,
            @RequestParam String state,
            @RequestParam String pinCode,
            @RequestParam(required = false) MultipartFile licenseFile,
            @RequestParam(required = false) MultipartFile idProofFile
    ) {

        // 1️⃣ DUPLICATE CHECK
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User already registered");
        }

        // 2️⃣ CREATE USER
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(Role.valueOf(role));
        user.setAddress(address);
        user.setCity(city);
        user.setState(state);
        user.setPinCode(pinCode);

        // 3️⃣ SET STATUS (THIS WAS MISSING)
        user.setStatus(UserStatus.PENDING);

        // 4️⃣ OPTIONAL FLAGS
        user.setTemporaryPassword(true);
        user.setCreatedAt(LocalDateTime.now());

        // 5️⃣ SAVE USER (CRITICAL)
        userRepository.save(user);

        return ResponseEntity.ok("Registered successfully. Await admin approval.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService.findByEmail(request.getEmail());

        if (user == null || user.getPassword() == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        if (user.isTemporaryPassword()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("TEMP_PASSWORD");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(token);
    }
    @PostMapping("/verify-temp-password")
    public ResponseEntity<?> verifyTempPassword(
            @RequestBody TempPasswordRequest req) {

        System.out.println(
                "VERIFY BACKEND → email=" + req.getEmail() +
                        ", temp=" + req.getTempPassword()
        );

        try {
            userService.verifyTempPassword(req.getEmail(), req.getTempPassword());
            return ResponseEntity.ok("VERIFIED");
        } catch (RuntimeException ex) {
            System.out.println("VERIFY BACKEND ERROR → " + ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }






    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest req) {

        User user = userService.findByEmail(req.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setTemporaryPassword(false);
        user.setTempPasswordExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok("PASSWORD_RESET_SUCCESS");
    }





}
