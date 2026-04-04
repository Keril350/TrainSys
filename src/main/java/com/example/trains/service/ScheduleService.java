package com.example.trains.service;

import com.example.trains.dto.ScheduleDTO;
import com.example.trains.model.Route;
import com.example.trains.model.Schedule;
import com.example.trains.model.Train;
import com.example.trains.repository.RouteRepository;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final TrainRepository trainRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           TrainRepository trainRepository,
                           RouteRepository routeRepository) {
        this.scheduleRepository = scheduleRepository;
        this.trainRepository = trainRepository;
        this.routeRepository = routeRepository;
    }

    public ScheduleDTO createSchedule(ScheduleDTO dto) {

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Route route = routeRepository.findById(dto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Schedule schedule = new Schedule();
        schedule.setTrain(train);
        schedule.setRoute(route);
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
        dto.setTrainId(schedule.getTrain().getId());
        dto.setRouteId(schedule.getRoute().getId());
        dto.setArrivalTime(schedule.getArrivalTime());
        dto.setDepartureTime(schedule.getDepartureTime());
        return dto;
    }
}