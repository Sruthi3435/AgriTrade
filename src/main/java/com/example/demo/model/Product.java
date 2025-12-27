package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private double quantity;
    private String unit;
    private double price;
    private String location;
    private String description;
    @Column(columnDefinition = "LONGTEXT")
    private String images;

  

    // NEW
    private LocalDateTime biddingStart;
    private LocalDateTime biddingEnd;
    private boolean closed = false;

    private String farmerEmail;
}
