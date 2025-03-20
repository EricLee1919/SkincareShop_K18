package com.example.demo.api;

import com.example.demo.entity.Account;
import com.example.demo.service.AuthenticationService;
import com.example.demo.utils.AccountUtils;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "api")
public class UsersAPI {

    @Autowired
    AccountUtils accountUtils;

    @GetMapping(path = "/me")
    public ResponseEntity<Account> getCurrentProfile() {
        Account currentAccount = accountUtils.getCurrentAccount();
        return ResponseEntity.ok(currentAccount);
    }

}
