package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* =====================================================
       REGISTER USER (NO PASSWORD, NO TEMP PASSWORD)
       ===================================================== */
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

        // 🔒 AUTH FIELDS
        user.setPassword(null);                 // permanent password not set
        user.setTempPassword(null);             // temp password created only on approval
        user.setFirstLogin(true);               // force reset on first login
        user.setStatus(UserStatus.PENDING);     // waiting for admin
        user.setTempPasswordExpiry(null);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    /* =====================================================
       FIND USER
       ===================================================== */
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /* =====================================================
       ADMIN APPROVES USER
       ===================================================== */
    @Override
    public void approveUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String tempPassword = UUID.randomUUID()
                .toString()
                .substring(0, 8);

        user.setTempPassword(passwordEncoder.encode(tempPassword));
        user.setTempPasswordExpiry(LocalDateTime.now().plusHours(24));
        user.setFirstLogin(true);
        user.setStatus(UserStatus.APPROVED);

        userRepository.save(user);

        // TODO: Replace with email service
        System.out.println("TEMP PASSWORD SENT → " + tempPassword);
    }

    /* =====================================================
       RESET PASSWORD (FIRST LOGIN ONLY)
       ===================================================== */
    @Override
    public void resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isFirstLogin()) {
            throw new RuntimeException("Password already set");
        }

        if (user.getTempPasswordExpiry() != null &&
                user.getTempPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Temporary password expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setTempPassword(null);
        user.setFirstLogin(false);
        user.setTempPasswordExpiry(null);

        userRepository.save(user);
    }
}
