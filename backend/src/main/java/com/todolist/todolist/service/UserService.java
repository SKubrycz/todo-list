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

    public boolean verifyUsername(String username) {
        if (username == null || username.isEmpty()) {
            return false;
        }

        if (username.length() < MIN_USERNAME_LENGTH || username.length() > MAX_USERNAME_LENGTH) return false;

        String regex = "^(?=.{" + MIN_USERNAME_LENGTH + "," + MAX_USERNAME_LENGTH + "}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(username);


        return matcher.matches();
    }

    public boolean verifyEmail(String email) {

        return true;
    }

    public boolean verifyPassword(String password) {

        return true;
    }

    public boolean saveUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return false;
        }

        if (!verifyUsername(userDTO.getUsername())) return false;
        if (!verifyEmail(userDTO.getEmail())) return false;
        if (!verifyPassword(userDTO.getPassword())) return false;

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
