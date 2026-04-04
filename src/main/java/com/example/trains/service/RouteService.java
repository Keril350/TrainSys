package com.example.trains.service;

import com.example.trains.dto.RouteDTO;
import com.example.trains.dto.RouteStationDTO;
import com.example.trains.model.Route;
import com.example.trains.model.RouteStation;
import com.example.trains.model.Station;
import com.example.trains.repository.RouteRepository;
import com.example.trains.repository.RouteStationRepository;
import com.example.trains.repository.StationRepository;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStationRepository routeStationRepository;
    private final StationRepository stationRepository;

    public RouteService(RouteRepository routeRepository,
                        RouteStationRepository routeStationRepository,
                        StationRepository stationRepository) {
        this.routeRepository = routeRepository;
        this.routeStationRepository = routeStationRepository;
        this.stationRepository = stationRepository;
    }

    public Route createRoute(RouteDTO dto) {

        Route route = new Route();
        route.setName(dto.getName());

        Route savedRoute = routeRepository.save(route);

        Set<Integer> stationIds = new HashSet<>();
        Set<Integer> orders = new HashSet<>();

        for (RouteStationDTO s : dto.getStations()) {

            if (!stationIds.add(s.getStationId())) {
                throw new RuntimeException("Duplicate station in route");
            }

            if (!orders.add(s.getStationOrder())) {
                throw new RuntimeException("Duplicate station order in route");
            }
        }

        for (RouteStationDTO stationDTO : dto.getStations()) {

            Station station = stationRepository.findById(stationDTO.getStationId())
                    .orElseThrow(() -> new RuntimeException("Station not found"));

            RouteStation rs = new RouteStation();
            rs.setRoute(savedRoute);
            rs.setStation(station);
            rs.setStationOrder(stationDTO.getStationOrder());

            routeStationRepository.save(rs);
        }

        return savedRoute;
    }

    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public RouteDTO getRouteById(Integer id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        return mapToDTO(route);
    }

    private RouteDTO mapToDTO(Route route) {

        RouteDTO dto = new RouteDTO();
        dto.setId(route.getId());
        dto.setName(route.getName());

        List<RouteStationDTO> stations = routeStationRepository
                .findByRouteIdOrderByStationOrder(route.getId())
                .stream()
                .map(rs -> {
                    RouteStationDTO s = new RouteStationDTO();
                    s.setStationId(rs.getStation().getId());
                    s.setStationName(rs.getStation().getName());
                    s.setStationOrder(rs.getStationOrder());
                    return s;
                })
                .toList();

        dto.setStations(stations);

        return dto;
    }
}