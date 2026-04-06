package com.example.trains.controller;

import com.example.trains.dto.SeatDTO;
import com.example.trains.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // POST
    @PostMapping
    public SeatDTO createSeat(@RequestBody @Valid SeatDTO dto) {
        return seatService.createSeat(dto);
    }

    // GET ALL
    @GetMapping
    public List<SeatDTO> getAllSeats() {
        return seatService.getAllSeats();
    }

    // GET by train
    @GetMapping("/train/{trainId}")
    public List<SeatDTO> getSeatsByTrain(@PathVariable Integer trainId) {
        return seatService.getSeatsByTrainId(trainId);
    }

    @GetMapping("/taken/{scheduleId}")
    public List<SeatDTO> getTakenSeats(@PathVariable Integer scheduleId) {
        return seatService.getTakenSeats(scheduleId);
    }

    @GetMapping("/available/{scheduleId}")
    public List<SeatDTO> getAvailableSeats(@PathVariable Integer scheduleId) {
        return seatService.getAvailableSeats(scheduleId);
    }

    @PutMapping("/{id}")
    public SeatDTO updateSeat(@PathVariable Integer id,
                              @RequestBody @Valid SeatDTO dto) {
        return seatService.updateSeat(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteSeat(@PathVariable Integer id) {
        seatService.deleteSeat(id);
    }
}