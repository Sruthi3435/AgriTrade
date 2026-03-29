package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {



    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
    long countByStatus(UserStatus status);

    List<User> findByStatus(UserStatus status);


}
