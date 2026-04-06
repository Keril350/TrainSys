package com.example.trains.controller;

import com.example.trains.dto.ScheduleDTO;
import com.example.trains.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // POST
    @PostMapping
    public ScheduleDTO createSchedule(@RequestBody @Valid ScheduleDTO dto) {
        return scheduleService.createSchedule(dto);
    }

    // GET
    @GetMapping
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // GET by id
    @GetMapping("/{id}")
    public ScheduleDTO getScheduleById(@PathVariable Integer id) {
        return scheduleService.getScheduleById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    @PutMapping("/{id}")
    public ScheduleDTO updateSchedule(@PathVariable Integer id,
                                      @RequestBody @Valid ScheduleDTO dto) {
        return scheduleService.updateSchedule(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Integer id) {
        scheduleService.deleteSchedule(id);
    }
}