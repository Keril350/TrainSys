package com.example.trains.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    @NotBlank(message = "Username must not be empty")
    private String username;

    @NotBlank(message = "Password must not be empty")
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String middleName;

    private String role; // USER / WORKER / ADMIN
}