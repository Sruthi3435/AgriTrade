package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
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

    @PutMapping("/reject/{id}")
    public void reject(@PathVariable Long id) {
        adminService.rejectUser(id);
    }
}
