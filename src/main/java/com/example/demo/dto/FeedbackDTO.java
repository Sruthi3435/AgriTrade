package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FeedbackDTO {
    private int rating;
    private String comment;
    private String retailerEmail;
    private LocalDateTime createdAt;
}
