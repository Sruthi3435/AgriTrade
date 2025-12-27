package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;

public interface UserService {

    User registerUser(RegisterRequest request);


        User verifyTempPassword(String email, String tempPassword);



    User findByEmail(String email);


}
