package com.example.demo.dto;

import com.example.demo.model.User;

import java.util.List;

public class AdminDashboardStats{

    private long total;
    private long approved;
    private long pending;
    private long rejected;
    private List<User> users;

    public AdminDashboardStats(
            long total,
            long approved,
            long pending,
            long rejected,
            List<User> users
    ) {
        this.total = total;
        this.approved = approved;
        this.pending = pending;
        this.rejected = rejected;
        this.users = users;
    }

    // getters
}

