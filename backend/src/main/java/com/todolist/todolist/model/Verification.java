package com.todolist.todolist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users-verification")
public class Verification {
    private final int EXPIRES_IN = 60 * 60; // seconds

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID uuid;

    @Column(nullable = false)
    private String verificationCode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isVerified = false;

    public Verification(UUID uuid, String verificationCode) {
        this.uuid = uuid;
        this.verificationCode = verificationCode;
        this.createdAt = LocalDateTime.now();
    }
}
