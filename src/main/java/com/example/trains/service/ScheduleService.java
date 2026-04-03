package com.example.trains.service;

import com.example.trains.dto.ScheduleDTO;
import com.example.trains.model.Schedule;
import com.example.trains.model.Station;
import com.example.trains.model.Train;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.StationRepository;
import com.example.trains.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           StationRepository stationRepository,
                           TrainRepository trainRepository) {
        this.scheduleRepository = scheduleRepository;
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
    }

    public ScheduleDTO createSchedule(ScheduleDTO dto) {
        Schedule schedule = new Schedule();

        Station station = stationRepository.findById(dto.getStationId())
                .orElseThrow(() -> new RuntimeException("Station with id " + dto.getStationId() + " not found"));

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train with id " + dto.getTrainId() + " not found"));

        schedule.setStation(station);
        schedule.setTrain(train);
        schedule.setRoute(dto.getRoute());
        schedule.setArrivalTime(dto.getArrivalTime());
        schedule.setDepartureTime(dto.getDepartureTime());

        Schedule saved = scheduleRepository.save(schedule);

        return mapToDTO(saved);
    }

    public List<ScheduleDTO> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ScheduleDTO> getScheduleById(Integer id) {
        return scheduleRepository.findById(id)
                .map(this::mapToDTO);
    }

    public void deleteSchedule(Integer id) {
        scheduleRepository.deleteById(id);
    }

    private ScheduleDTO mapToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setStationId(schedule.getStation().getId());
        dto.setTrainId(schedule.getTrain().getId());
        dto.setRoute(schedule.getRoute());
        dto.setArrivalTime(schedule.getArrivalTime());
        dto.setDepartureTime(schedule.getDepartureTime());
        return dto;
    }
}