package com.todolist.todolist.controller;

import com.todolist.todolist.config.JwtUtil;
import com.todolist.todolist.dto.UserDTO;
import com.todolist.todolist.dto.VerificationDTO;
import com.todolist.todolist.model.User;
import com.todolist.todolist.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    @Autowired
    UserService userService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtil jwtutil;

    @PostMapping("/login")
    public String authenticateUser(@Valid @RequestBody UserDTO userDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtutil.generateToken(userDetails.getUsername());
    }

    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody UserDTO userDTO) {
        boolean success = userService.saveUser(userDTO);
        if (!success) {
            return "Error trying to register account";
        }
        return "Account registered successfully";
    }

    @PostMapping("/verify/{uuid}")
    public String verifyUser(@PathVariable("uuid") UUID uuid, @Valid @RequestBody VerificationDTO verificationDTO) {
        userService.verify(uuid, verificationDTO.getVerificationCode());

        return "Account verified successfully";
    }
}
