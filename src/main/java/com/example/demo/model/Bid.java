package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bids")
@Getter
@Setter
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private String farmerEmail;

    private String retailerEmail;

    private Double amount;

    private LocalDateTime createdAt;

    @Column(name = "accepted")
    private boolean accepted = false;
}
