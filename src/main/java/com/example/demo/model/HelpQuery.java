package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
public class HelpQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // user name
    private String email;
    private String role;          // FARMER / RETAILER

    private String subject;

    @Column(length = 1000)
    private String message;

    private String status;        // OPEN / RESOLVED

    private LocalDateTime createdAt;

    // getters & setters
}
