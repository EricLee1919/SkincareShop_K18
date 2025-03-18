package com.example.demo.api;

import com.example.demo.entity.Account;
import com.example.demo.entity.request.*;
import com.example.demo.entity.response.AuthenticationResponse;
import com.example.demo.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("login-google")
    public ResponseEntity loginGoogle(@RequestBody LoginGoogleRequest loginGoogleRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.loginGoogle(loginGoogleRequest);
        return ResponseEntity.ok(authenticationResponse);
    }


    @PostMapping("forgot-password")
    public ResponseEntity forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
       authenticationService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("Fogot Password Successfully");
    }

    @PostMapping("reset-password")
    public ResponseEntity resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        authenticationService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Reset Password Successfully");
    }


}
