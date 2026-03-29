package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor   // ✅ THIS IS REQUIRED
public class InvoiceDTO {

    private Long orderId;
    private LocalDateTime createdAt;
    private double finalPrice;

    // Retailer
    private String retailerName;
    private String retailerEmail;
    private String retailerPhone;
    private String retailerAddress;

    // Farmer
    private String farmerName;
    private String farmerEmail;
    private String farmerPhone;
    private String location;

    // Product
    private String productName;
    private double quantity;
}
