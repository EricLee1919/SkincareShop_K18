package com.example.demo.api;

import com.example.demo.entity.Account;
import com.example.demo.entity.request.AccountRequest;
import com.example.demo.entity.request.AuthenticationRequest;
import com.example.demo.entity.response.AuthenticationResponse;
import com.example.demo.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@SecurityRequirement(name = "api")
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("register")
    public ResponseEntity register(@Valid @RequestBody AccountRequest account) {
        Account newAccount = authenticationService.register(account);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.login(authenticationRequest);
        return ResponseEntity.ok(authenticationResponse);
    }

    @PutMapping("profile")
    public ResponseEntity updateProfile(@RequestBody AccountRequest accountRequest) {
        Account account = authenticationService.updateProfile(accountRequest);
        return ResponseEntity.ok(account);
    }

    @GetMapping("profile")
    public ResponseEntity getProfile() {
        Account account = authenticationService.getCurrentAccount();
        return ResponseEntity.ok(account);
    }

    @PatchMapping("block/user/{userId}")
    public ResponseEntity block(@PathVariable long userId, @RequestParam boolean isBlocked) {
        Account account = authenticationService.block(userId, isBlocked);
        return ResponseEntity.ok(account);
    }

    @GetMapping("users")
    public ResponseEntity getAll() {
        List<Account> accounts = authenticationService.getAll();
        return ResponseEntity.ok(accounts);
    }

}
