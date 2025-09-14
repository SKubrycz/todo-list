package com.todolist.todolist.repository;


import com.todolist.todolist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByVerification_Uuid(UUID uuid);
    boolean existsByUsername(String username);
}
