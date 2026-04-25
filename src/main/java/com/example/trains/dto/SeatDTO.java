package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatDTO {

    private Integer id;

    @NotNull(message = "Wagon ID must not be null")
    private Integer wagonId;

    @NotBlank(message = "Seat number must not be empty")
    private String number;
}