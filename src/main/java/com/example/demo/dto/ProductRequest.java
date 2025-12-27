package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductRequest {
    private String name;
    private String category;
    private double quantity;
    private String unit;
    private double price;
    private String location;
    private String description;
    private LocalDateTime biddingStart;
    private LocalDateTime biddingEnd;
}
