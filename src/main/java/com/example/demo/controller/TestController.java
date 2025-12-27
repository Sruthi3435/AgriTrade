package com.example.demo.controller;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/test")

public class TestController {
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @GetMapping
    public String test() {
        System.out.println(passwordEncoder.encode("Sruthi@123"));

        return "Backend is running";
    }
}
