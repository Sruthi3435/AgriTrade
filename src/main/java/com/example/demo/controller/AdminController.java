package com.example.demo.controller;

import com.example.demo.model.HelpQuery;
import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.HelpQueryRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")

public class AdminController {
private final HelpQueryRepository helpQueryRepository;
    private final AdminService adminService;
private final UserRepository userRepository;
    public AdminController(AdminService adminService ,UserRepository userRepository,HelpQueryRepository helpQueryRepository) {
        this.adminService = adminService;
        this.userRepository=userRepository;
        this.helpQueryRepository=helpQueryRepository;
    }
    @PutMapping("/help-queries/{id}/resolve")
    public ResponseEntity<String> resolveQuery(@PathVariable Long id) {

        HelpQuery query = helpQueryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        query.setStatus("RESOLVED");
        helpQueryRepository.save(query);

        return ResponseEntity.ok("Query resolved");
    }

    @GetMapping("/pending-users")
    public List<User> getPendingUsers() {
        return adminService.getPendingUsers();
    }


    @PutMapping("/approve/{userId}")
    public ResponseEntity<String> approveUser(@PathVariable Long userId) {
        adminService.approveUser(userId);
        return ResponseEntity.ok("Temporary password sent to user email");
    }
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {

        long total = userRepository.count();
        long pending = userRepository.countByStatus(UserStatus.PENDING);
        long approved = userRepository.countByStatus(UserStatus.APPROVED);
        long rejected = userRepository.countByStatus(UserStatus.REJECTED);

        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("pending", pending);
        response.put("approved", approved);
        response.put("rejected", rejected);

        // send only pending users for table
        response.put(
                "users",
                userRepository.findByStatus(UserStatus.PENDING)
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/help-queries")
    public ResponseEntity<?> getHelpQueries() {

        List<HelpQuery> queries =
                helpQueryRepository.findByStatusOrderByCreatedAtDesc("OPEN");

        return ResponseEntity.ok(queries);
    }

    @PutMapping("/reject/{id}")
    public void reject(@PathVariable Long id) {
        adminService.rejectUser(id);
    }
}
