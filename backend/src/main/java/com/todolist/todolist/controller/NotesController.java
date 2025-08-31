package com.todolist.todolist.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notes")
public class NotesController {
    // Authenticate user and then provide an appropriate set of notes
    @GetMapping("/")
    public ResponseEntity<String> getNotes() {
        return ResponseEntity.ok("Notes WIP");
    }

}
