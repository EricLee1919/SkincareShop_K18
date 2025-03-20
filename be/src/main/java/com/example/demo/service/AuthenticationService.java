package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.entity.request.*;
import com.example.demo.entity.response.AuthenticationResponse;
import com.example.demo.enums.RoleEnum;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.model.EmailDetail;
import com.example.demo.repository.AuthenticationRepository;
import com.example.demo.utils.AccountUtils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TokenService tokenService;

    @Autowired
    EmailService emailService;

    @Autowired
    AccountUtils accountUtils;

    public Account register(AccountRequest accountRequest){
        // xử lý logic

        // lưu xuống database

        Account account = new Account();

        account.setUsername(accountRequest.getUsername());
        account.setRoleEnum(RoleEnum.CUSTOMER);
        account.setPassword(passwordEncoder.encode(accountRequest.getPassword()));
        account.setFullName(accountRequest.getFullName());
        account.setEmail(accountRequest.getEmail());

        Account newAccount = authenticationRepository.save(account);
        return newAccount;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authenticationRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }


    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getUsername(),
                            authenticationRequest.getPassword()
                    )
            );
        }catch (Exception e){
            throw new NullPointerException("Wrong username or password");
        }
         Account account = authenticationRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow();
         String token = tokenService.generateToken(account);

         AuthenticationResponse authenticationResponse = new AuthenticationResponse();
         authenticationResponse.setEmail(account.getEmail());
         authenticationResponse.setId(account.getId());
         authenticationResponse.setFullName(account.getFullName());
         authenticationResponse.setUsername(account.getUsername());
         authenticationResponse.setRoleEnum(account.getRoleEnum());
         authenticationResponse.setToken(token);

         return authenticationResponse;
    }

    public AuthenticationResponse loginGoogle(LoginGoogleRequest loginGoogleRequest) {
        try {
            FirebaseToken decodeToken = FirebaseAuth.getInstance().verifyIdToken(loginGoogleRequest.getToken());
            String email = decodeToken.getEmail();
            Account account = authenticationRepository.findByEmail(email);

            // neu login gg tk email nay chua dc dk thi dk
            if(account == null){
                account = new Account();
                account.setFullName(decodeToken.getName());
                account.setEmail(email);
                account.setUsername(email);
                account.setRoleEnum(RoleEnum.CUSTOMER);
                account = authenticationRepository.save(account);
            }
            String token = tokenService.generateToken(account);

            AuthenticationResponse authenticationResponse = new AuthenticationResponse();
            authenticationResponse.setEmail(account.getEmail());
            authenticationResponse.setId(account.getId());
            authenticationResponse.setFullName(account.getFullName());
            authenticationResponse.setUsername(account.getUsername());
            authenticationResponse.setRoleEnum(account.getRoleEnum());
            authenticationResponse.setToken(token);


            return authenticationResponse;
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }

        return null;

    }

    public void forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        Account account = authenticationRepository.findByEmail(forgotPasswordRequest.getEmail());
        if(account == null){
            throw new NotFoundException("User not found");
        }
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setRecipient(account.getEmail()); // set email dc gui toi ai
        emailDetail.setSubject("Reset Password for account  " + account.getEmail() + "!"); // ten tieu de email
        emailDetail.setMsgBody("aaa");
        emailDetail.setButtonValue("Reset Password"); // gia tri cua button trong form email
        emailDetail.setFullName(account.getFullName());
        emailDetail.setLink("https://fodoshi.shop?token=" + tokenService.generateToken(account));

        // cho qua truoc gui mail sau
        Runnable r = new Runnable() {
            @Override
            public void run() {
                emailService.sendMailTemplate(emailDetail);
            }
        };
        new Thread(r).start();

    }

    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        Account account = accountUtils.getCurrentAccount();
        account.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        authenticationRepository.save(account);
    }
}
