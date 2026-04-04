package com.example.trains.controller;

import com.example.trains.dto.RouteDTO;
import com.example.trains.model.Route;
import com.example.trains.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public Route createRoute(@RequestBody @Valid RouteDTO dto) {
        return routeService.createRoute(dto);
    }

    @GetMapping
    public List<RouteDTO> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public RouteDTO getRouteById(@PathVariable Integer id) {
        return routeService.getRouteById(id);
    }
}