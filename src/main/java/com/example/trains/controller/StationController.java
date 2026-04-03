package com.example.trains.controller;

import com.example.trains.dto.StationDTO;
import com.example.trains.service.StationService;
import jakarta.validation.Valid;
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
    public StationDTO createStation(@RequestBody @Valid StationDTO dto) {
        return stationService.createStation(dto);
    }

    // GET
    @GetMapping
    public List<StationDTO> getAllStations() {
        return stationService.getAllStations();
    }

    // GET by ID
    @GetMapping("/{id}")
    public StationDTO getStationById(@PathVariable Integer id) {
        return stationService.getStationById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteStation(@PathVariable Integer id) {
        stationService.deleteStation(id);
    }
}