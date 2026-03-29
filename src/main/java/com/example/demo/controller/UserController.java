package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔹 GET logged-in user details
    @GetMapping("/me")
    public User getMyProfile(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 🔹 UPDATE logged-in user details
    @PutMapping("/update")
    public User updateMyProfile(
            Authentication authentication,
            @RequestBody User req
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Update ONLY editable fields
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setCity(req.getCity());
        user.setState(req.getState());
        user.setPinCode(req.getPinCode());

        if ("RETAILER".equals(user.getRole())) {
            user.setBusinessName(req.getBusinessName());
        }

        if ("FARMER".equals(user.getRole())) {
            user.setCropType(req.getCropType());
        }

        return userRepository.save(user);
    }
}
