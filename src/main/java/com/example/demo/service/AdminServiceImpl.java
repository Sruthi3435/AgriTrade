package com.example.demo.service;

import com.example.demo.dto.AdminDashboardStats;
import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AdminServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public List<User> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING);
    }

    @Override
    public void approveUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1️⃣ Generate temporary password
        String tempPassword = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8);


        System.out.println("Temp password: " + tempPassword);

        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setTemporaryPassword(true);
        user.setTempPasswordExpiry(LocalDateTime.now().plusHours(24));
        user.setStatus(UserStatus.APPROVED);

        userRepository.save(user);
        emailService.sendTempPassword(user.getEmail(), tempPassword);

    }


    @Override
    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setStatus(UserStatus.REJECTED);
        userRepository.save(user);
    }


    @Override
    public AdminDashboardStats getDashboardStats() {

        long total = userRepository.count();
        long approved = userRepository.countByStatus(UserStatus.APPROVED);
        long pending = userRepository.countByStatus(UserStatus.PENDING);
        long rejected = userRepository.countByStatus(UserStatus.REJECTED);

        List<User> users = userRepository.findByStatus(UserStatus.PENDING);

        return new AdminDashboardStats(
                total,
                approved,
                pending,
                rejected,
                users
        );
    }

}
