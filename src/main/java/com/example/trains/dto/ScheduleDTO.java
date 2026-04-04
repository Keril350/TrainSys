package com.example.trains.dto;

import com.example.trains.validation.ValidScheduleTime;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@ValidScheduleTime
public class ScheduleDTO {

    private Integer id;

    @NotNull(message = "Train ID must not be null")
    private Integer trainId;

    @NotNull(message = "Route ID must not be null")
    private Integer routeId;

    @NotNull(message = "Arrival time must not be null")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Departure time must not be null")
    private LocalDateTime departureTime;
}