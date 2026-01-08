package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;


    private String phone;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    private String address;
    private String city;
    private String state;
    private String pinCode;

    private String cropType;
    private String businessName;
    @JsonIgnore
    @Column(name = "temporary_password")
    private boolean temporaryPassword;

    @Column(name = "temp_password_expiry")
    private LocalDateTime tempPasswordExpiry;

    @Enumerated(EnumType.STRING)
    private UserStatus status;
    @JsonIgnore
    private LocalDateTime createdAt = LocalDateTime.now();
}








