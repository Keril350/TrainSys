package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WagonDTO {

    private Integer id;

    private Integer trainId;

    private Integer number;

    private BigDecimal price;
}