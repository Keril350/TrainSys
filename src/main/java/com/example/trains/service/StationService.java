package com.example.trains.service;

import com.example.trains.model.Station;
import com.example.trains.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public Station createStation(Station station) {
        return stationRepository.save(station);
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Optional<Station> getStationById(Integer id) {
        return stationRepository.findById(id);
    }

    public void deleteStation(Integer id) {
        stationRepository.deleteById(id);
    }
}