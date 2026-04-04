package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RouteDTO {

    private Integer id;

    @NotBlank(message = "Route name must not be empty")
    private String name;

    // список станций в маршруте
    private List<RouteStationDTO> stations;
}