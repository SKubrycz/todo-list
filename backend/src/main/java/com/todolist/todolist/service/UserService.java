package com.todolist.todolist.service;

import com.todolist.todolist.model.User;
import com.todolist.todolist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;

    public String saveUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return null;
        }
        User newUser = new User(
                null,
                user.getUsername(),
                encoder.encode(user.getPassword())
        );
        userRepository.save(newUser);

        return "User registered successfully";
    }

}
