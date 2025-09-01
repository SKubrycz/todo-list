package com.todolist.todolist.repository;

import com.todolist.todolist.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
}
