package com.example.demo.service;

import com.example.demo.dto.AdminDashboardStats;
import com.example.demo.model.User;
import java.util.List;

public interface AdminService {

    List<User> getPendingUsers();

    void approveUser(Long userId);

    void rejectUser(Long userId);
    public AdminDashboardStats getDashboardStats() ;
}
