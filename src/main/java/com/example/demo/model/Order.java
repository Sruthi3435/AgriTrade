package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "farmer_email")
    private String farmerEmail;

    @Column(name = "retailer_email")
    private String retailerEmail;

    @Column(name = "final_price")
    private double finalPrice;

    @Column(name = "status")
    private String orderStatus; // CONFIRMED, DELIVERED

    @Column(name = "delivery_status")
    private String deliveryStatus; // CONFIRMED, DELIVERED
}
