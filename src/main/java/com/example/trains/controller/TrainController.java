package com.example.trains.controller;

import com.example.trains.dto.TrainDTO;
import com.example.trains.service.TrainService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    // POST
    @PostMapping
    public TrainDTO createTrain(@RequestBody @Valid TrainDTO dto) {
        return trainService.createTrain(dto);
    }

    // GET ALL
    @GetMapping
    public List<TrainDTO> getAllTrains() {
        return trainService.getAllTrains();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public TrainDTO getTrainById(@PathVariable Integer id) {
        return trainService.getTrainById(id);
    }

    @PutMapping("/{id}")
    public TrainDTO updateTrain(@PathVariable Integer id,
                                @RequestBody @Valid TrainDTO dto) {
        return trainService.updateTrain(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteTrain(@PathVariable Integer id) {
        trainService.deleteTrain(id);
    }
}