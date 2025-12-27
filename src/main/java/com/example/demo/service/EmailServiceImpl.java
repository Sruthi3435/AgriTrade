package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendTempPassword(String to, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Account Approved - Temporary Password");
        message.setText(
                "Your account has been approved.\n\n" +
                        "Temporary Password: " + tempPassword + "\n\n" +
                        "Please login and reset your password immediately."
        );

        mailSender.send(message);
    }

    public void sendBidAcceptedEmail(String toEmail, String productName, double amount) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Bid Accepted!");
        msg.setText("Your bid for product '" + productName + "' was accepted.\n" +
                "Winning Amount: ₹" + amount);

        mailSender.send(msg);
    }
}
