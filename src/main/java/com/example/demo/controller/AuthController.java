package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // REGISTER
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

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already registered");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(Role.valueOf(role));
        user.setAddress(address);
        user.setCity(city);
        user.setState(state);
        user.setPinCode(pinCode);

        user.setStatus(UserStatus.PENDING);
        user.setPassword(null);
        user.setTempPassword(null);
        user.setFirstLogin(true);

        userRepository.save(user);

        return ResponseEntity.ok("Registered. Await admin approval.");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        if (user.getStatus() != UserStatus.APPROVED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("ACCOUNT_NOT_APPROVED");
        }

        // FIRST LOGIN → TEMP PASSWORD
        if (user.isFirstLogin()) {

            if (user.getTempPassword() == null ||
                    !passwordEncoder.matches(request.getPassword(), user.getTempPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("INVALID_TEMP_PASSWORD");
            }

            return ResponseEntity.ok(Map.of("status", "FIRST_LOGIN"));
        }

        // NORMAL LOGIN
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "token", token
        ));
    }

    // SET NEW PASSWORD (FIRST LOGIN ONLY)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {

        User user = userRepository.findByEmail(req.getEmail()).orElse(null);

        if (user == null || !user.isFirstLogin()) {
            return ResponseEntity.badRequest().body("Invalid request");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setTempPassword(null);
        user.setFirstLogin(false);
        user.setTempPasswordExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok("PASSWORD_RESET_SUCCESS");
    }
}
