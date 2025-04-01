package com.example.demo.entity.response;

import com.example.demo.enums.RoleEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class AuthenticationResponse {
    public long id;
    public String fullName;
    public String username;
    public String email;
    public String phone;
    public String address;
    @Enumerated(value = EnumType.STRING)
    public RoleEnum roleEnum;
    public String token;
}
