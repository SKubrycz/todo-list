package com.todolist.todolist.service;

import com.todolist.todolist.dto.UserDTO;
import com.todolist.todolist.model.User;
import com.todolist.todolist.model.Verification;
import com.todolist.todolist.repository.UserRepository;
import com.todolist.todolist.util.VerificationCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserService {
    private final int MIN_USERNAME_LENGTH = 3;
    private final int MAX_USERNAME_LENGTH = 50;
    private final String ALLOWED_USERNAME_CHARACTERS = "";
    private final int MIN_PASSWORD_LENGTH = 8;

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;

    public boolean saveUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return false;
        }

        Verification verification = new Verification(UUID.randomUUID(), VerificationCodeGenerator.generateVerificationCode());

        User newUser = new User(
                null,
                userDTO.getUsername(),
                userDTO.getEmail(),
                encoder.encode(userDTO.getPassword()),
                verification
        );
        userRepository.save(newUser);

        return true;
    }

    public boolean verify(UUID uuid, String verificationCode) {
        User user = userRepository.findByVerification_Uuid(uuid);

        if (!Objects.equals(user.getVerification().getVerificationCode(), verificationCode)) return false;

        return true;
    }

}
