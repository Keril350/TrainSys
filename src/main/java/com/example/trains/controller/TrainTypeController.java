package com.example.trains.controller;

import com.example.trains.model.TrainType;
import com.example.trains.repository.TrainTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/train-types")
public class TrainTypeController {

    private final TrainTypeRepository repository;

    public TrainTypeController(TrainTypeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TrainType> getAll() {
        return repository.findAll();
    }
}