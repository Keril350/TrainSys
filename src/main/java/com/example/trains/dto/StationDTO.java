package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StationDTO {

    private Integer id;

    @NotBlank(message = "Name must not be empty")
    private String name;

    @NotBlank(message = "City must not be empty")
    private String city;

    @NotBlank(message = "Code must not be empty")
    private String code;
}