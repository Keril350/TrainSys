package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatDTO {

    private Integer id;
    private String number;

    private Integer wagonId;
    private Integer wagonNumber;

    private Integer trainId;
    private String trainNumber;
}