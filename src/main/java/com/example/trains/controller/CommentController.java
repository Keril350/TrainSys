package com.example.trains.controller;

import com.example.trains.dto.CommentDTO;
import com.example.trains.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @GetMapping
    public List<CommentDTO> getAll() {
        return service.getAll();
    }

    @PostMapping
    public CommentDTO create(@RequestBody String content) {
        return service.create(content);
    }
}