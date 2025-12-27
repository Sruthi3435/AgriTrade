package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "to_email")
    private String toEmail;
    private String message;
    @Column(name = "is_read")
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

}
