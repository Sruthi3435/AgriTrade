package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;

public interface UserService {



    User registerUser(RegisterRequest request);


    User findByEmail(String email);

    void approveUser(Long userId);

    void resetPassword(String email, String newPassword);

}
