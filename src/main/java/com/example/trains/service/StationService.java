package com.example.trains.service;

import com.example.trains.dto.StationDTO;
import com.example.trains.model.Station;
import com.example.trains.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    // CREATE
    public StationDTO createStation(StationDTO dto) {
        Station station = new Station();
        station.setName(dto.getName());
        station.setCity(dto.getCity());
        station.setCode(dto.getCode());

        Station saved = stationRepository.save(station);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<StationDTO> getAllStations() {
        return stationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public Optional<StationDTO> getStationById(Integer id) {
        return stationRepository.findById(id)
                .map(this::mapToDTO);
    }

    // DELETE
    public void deleteStation(Integer id) {
        stationRepository.deleteById(id);
    }

    // MAPPER
    private StationDTO mapToDTO(Station station) {
        StationDTO dto = new StationDTO();
        dto.setId(station.getId());
        dto.setName(station.getName());
        dto.setCity(station.getCity());
        dto.setCode(station.getCode());
        return dto;
    }
}