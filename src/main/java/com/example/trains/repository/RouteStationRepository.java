package com.example.trains.repository;

import com.example.trains.model.RouteStation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteStationRepository extends JpaRepository<RouteStation, Integer> {

    List<RouteStation> findByRouteIdOrderByStationOrder(Integer routeId);
}