package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    @NotBlank(message = "Username must not be empty")
    private String username;
    private Boolean admin;
}