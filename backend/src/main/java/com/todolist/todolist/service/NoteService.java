package com.todolist.todolist.service;


import com.todolist.todolist.dto.NoteDTO;
import com.todolist.todolist.model.Note;
import com.todolist.todolist.repository.NoteRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;

    public NoteService(NoteRepository noteRepository, ModelMapper modelMapper) {
        this.noteRepository = noteRepository;
        this.modelMapper = modelMapper;
    }

    public ArrayList<NoteDTO> getNotes() {
        List<Note> notesList = noteRepository.findAll();
        if (notesList.size() > 0) {
            ArrayList<NoteDTO> notesDTO = new ArrayList<NoteDTO>();
            notesList.forEach(note -> {
                notesDTO.add(modelMapper.map(note, NoteDTO.class));
            });


            return notesDTO;
        } else {
            return null;
        }
    }
}
