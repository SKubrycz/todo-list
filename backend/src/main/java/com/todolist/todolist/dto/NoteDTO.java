package com.todolist.todolist.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class NoteDTO {
    private UUID uuid;
    private String title;
    private String description;
    private LocalDateTime dateCreated;
    private LocalDateTime dateDone;
    private ArrayList<LabelDTO> labels;
    private boolean done;
}
