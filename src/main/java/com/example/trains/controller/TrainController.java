package com.example.trains.controller;

import com.example.trains.model.Train;
import com.example.trains.service.TrainService;
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
    public Train createTrain(@RequestBody Train train) {
        return trainService.createTrain(train);
    }

    // GET
    @GetMapping
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }

    // GETid
    @GetMapping("/{id}")
    public Train getTrainById(@PathVariable Integer id) {
        return trainService.getTrainById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteTrain(@PathVariable Integer id) {
        trainService.deleteTrain(id);
    }
}