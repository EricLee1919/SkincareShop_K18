package com.example.demo.repository;

import com.example.demo.entity.Account;
import com.example.demo.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface AuthenticationRepository extends JpaRepository<Account, Long> {

    Account findById(long id);


    Optional<Account> findByUsername(String username);

    Account findByEmail(String email);

    List<Account> findAllByRoleEnum(RoleEnum roleEnum);
}
