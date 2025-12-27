package com.example.demo.dto;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String name;
    private String email;
    private String phone;
    private Role role;

    // additional fields
    private String address;
    private String city;
    private String state;
    private String pinCode;

    // role-based fields
    private String cropType;        // FARMER
    private String businessName;    // RETAILER
}
