package com.example.demo.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class DashboardResponse {

    private long totalListings;
    private long activeListings;
    private double totalSales;
    private long pendingOrders;

    private Map<String, Long> ordersPerMonth;
    private Map<String, Long> categoryWisePurchases;

    private List<String> upcomingTasks;

    private String userName;
}
