package com.example.trains.controller;

import com.example.trains.dto.WagonDTO;
import com.example.trains.service.WagonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wagons")
@CrossOrigin
public class WagonController {

    private final WagonService wagonService;

    public WagonController(WagonService wagonService) {
        this.wagonService = wagonService;
    }

    @PostMapping
    public WagonDTO create(@RequestBody WagonDTO dto) {
        return wagonService.create(dto);
    }

    @GetMapping
    public List<WagonDTO> getAll() {
        return wagonService.getAll();
    }

    @GetMapping("/train/{trainId}")
    public List<WagonDTO> getByTrain(@PathVariable Integer trainId) {
        return wagonService.getByTrain(trainId);
    }

    @PutMapping("/{id}")
    public WagonDTO update(@PathVariable Integer id,
                           @RequestBody WagonDTO dto) {
        return wagonService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        wagonService.delete(id);
    }
}