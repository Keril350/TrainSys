package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDTO {

    private Integer id;
    private BigDecimal price;

    private Integer userId;

    private String firstName;
    private String lastName;
    private String middleName;

    private Integer scheduleId;

    private Integer trainId;
    private String trainNumber;

    private Integer seatId;
    private String seatNumber;

    private Integer wagonNumber;

    private LocalDateTime purchaseDate;
}