package com.example.trains.controller;

import com.example.trains.model.Station;
import com.example.trains.service.StationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    // POST
    @PostMapping
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    // GET
    @GetMapping
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }

    // GETid
    @GetMapping("/{id}")
    public Station getStationById(@PathVariable Integer id) {
        return stationService.getStationById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteStation(@PathVariable Integer id) {
        stationService.deleteStation(id);
    }
}