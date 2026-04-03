package com.example.trains.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDTO {

    private Integer id;

    @NotNull(message = "User ID must not be null")
    private Integer userId;

    @NotNull(message = "Schedule ID must not be null")
    private Integer scheduleId;

    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull
    private Integer seatId;

    private LocalDateTime purchaseDate;
}