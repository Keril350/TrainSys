package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class StatisticsDTO {

    private long trainsCount;
    private long routesCount;
    private long schedulesCount;
    private long ticketsCount;

    private BigDecimal totalRevenue;

    private String mostPopularRoute;
}