package com.example.demo.dto;

public class TempPasswordRequest {

    private String email;
    private String tempPassword;

    public String getEmail() {
        return email;
    }

    public String getTempPassword() {
        return tempPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }
}
