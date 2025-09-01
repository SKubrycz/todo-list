package com.todolist.todolist.controller;

import com.todolist.todolist.dto.NoteDTO;
import com.todolist.todolist.model.Note;
import com.todolist.todolist.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NoteService noteService;

    // Authenticate user and then provide an appropriate set of notes
    @GetMapping
    public ResponseEntity<ArrayList<NoteDTO>> getNotes() {
        ArrayList<NoteDTO> notesDTO = noteService.getNotes();

        if (notesDTO != null) {
            return ResponseEntity.ok(notesDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
