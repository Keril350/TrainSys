package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDTO {

    private Integer id;
    private Integer userId;
    private Integer scheduleId;
    private Integer seatId;

    private BigDecimal price;

    private LocalDateTime purchaseDate;
}