package com.example.demo.service;

public interface EmailService {
    void sendTempPassword(String to, String tempPassword);
    void sendBidAcceptedEmail(String toEmail, String productName, double amount);
}
