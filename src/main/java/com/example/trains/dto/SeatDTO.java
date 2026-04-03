package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatDTO {

    private Integer id;

    @NotNull(message = "Train ID must not be null")
    private Integer trainId;

    @NotBlank(message = "Seat number must not be empty")
    private String number;
}