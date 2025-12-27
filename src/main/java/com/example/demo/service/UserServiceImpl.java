package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setPinCode(request.getPinCode());
        user.setCropType(request.getCropType());
        user.setBusinessName(request.getBusinessName());

        // ✅ CORRECT
        user.setPassword(null);                  // No password yet
        user.setTemporaryPassword(true);

        user.setStatus(UserStatus.PENDING);
// No temp password yet
        user.setStatus(UserStatus.PENDING);      // Waiting for admin
        user.setTempPasswordExpiry(null);


        return userRepository.save(user);
    }

    @Override
    public User verifyTempPassword(String email, String tempPassword) {

        User user = userRepository
                .findByEmailAndTemporaryPasswordTrue(email)
                .orElseThrow(() -> new RuntimeException("Invalid code"));

        if (user.getTempPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Temporary password expired");
        }

        if (!passwordEncoder.matches(tempPassword, user.getPassword())) {
            throw new RuntimeException("Invalid temporary password");
        }

        return user;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
