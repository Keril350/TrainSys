package com.example.trains.controller;

import com.example.trains.model.WagonType;
import com.example.trains.repository.WagonTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wagon-types")
public class WagonTypeController {

    private final WagonTypeRepository repository;

    public WagonTypeController(WagonTypeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<WagonType> getAll() {
        return repository.findAll();
    }
}