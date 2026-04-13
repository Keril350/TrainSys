package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainDTO {

    private Integer id;

    @NotBlank(message = "Number must not be empty")
    private String number;

    @NotBlank(message = "Type must not be empty")
    private String type;
}