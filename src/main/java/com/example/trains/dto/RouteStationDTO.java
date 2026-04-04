package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RouteStationDTO {

    private Integer stationId;
    
    private String stationName;

    private Integer stationOrder;
}