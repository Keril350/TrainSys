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

        if (dto.getDepartureTime().isAfter(dto.getArrivalTime())) {
            throw new RuntimeException("Departure must be before arrival");
        }

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Route route = routeRepository.findById(dto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        List<Schedule> trainConflicts = scheduleRepository.findConflictingSchedules(
                dto.getTrainId(),
                dto.getDepartureTime(),
                dto.getArrivalTime()
        );

        if (!trainConflicts.isEmpty()) {
            throw new RuntimeException("Train is busy at this time");
        }

        List<Schedule> routeConflicts = scheduleRepository.findRouteConflicts(
                dto.getRouteId(),
                dto.getDepartureTime(),
                dto.getArrivalTime()
        );

        if (!routeConflicts.isEmpty()) {
            throw new RuntimeException("Route is busy at this time");
        }

        Schedule schedule = new Schedule();
        schedule.setTrain(train);
        schedule.setRoute(route);
        schedule.setDepartureTime(dto.getDepartureTime());
        schedule.setArrivalTime(dto.getArrivalTime());

        return mapToDTO(scheduleRepository.save(schedule));
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

    public ScheduleDTO updateSchedule(Integer id, ScheduleDTO dto) {

        if (dto.getDepartureTime().isAfter(dto.getArrivalTime())) {
            throw new RuntimeException("Departure must be before arrival");
        }

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Route route = routeRepository.findById(dto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        List<Schedule> trainConflicts = scheduleRepository.findConflictingSchedules(
                dto.getTrainId(),
                dto.getDepartureTime(),
                dto.getArrivalTime()
        );

        boolean trainConflict = trainConflicts.stream()
                .anyMatch(s -> !s.getId().equals(id));

        if (trainConflict) {
            throw new RuntimeException("Train is busy at this time");
        }

        List<Schedule> routeConflicts = scheduleRepository.findRouteConflicts(
                dto.getRouteId(),
                dto.getDepartureTime(),
                dto.getArrivalTime()
        );

        boolean routeConflict = routeConflicts.stream()
                .anyMatch(s -> !s.getId().equals(id));

        if (routeConflict) {
            throw new RuntimeException("Route is busy at this time");
        }

        schedule.setTrain(train);
        schedule.setRoute(route);
        schedule.setDepartureTime(dto.getDepartureTime());
        schedule.setArrivalTime(dto.getArrivalTime());

        return mapToDTO(scheduleRepository.save(schedule));
    }

    public void deleteSchedule(Integer id) {
        scheduleRepository.deleteById(id);
    }

    private ScheduleDTO mapToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();

        dto.setId(schedule.getId());

        dto.setTrainId(schedule.getTrain().getId());
        dto.setTrainNumber(schedule.getTrain().getNumber());

        dto.setRouteId(schedule.getRoute().getId());
        dto.setRouteName(schedule.getRoute().getName());

        dto.setDepartureTime(schedule.getDepartureTime());
        dto.setArrivalTime(schedule.getArrivalTime());

        return dto;
    }
}