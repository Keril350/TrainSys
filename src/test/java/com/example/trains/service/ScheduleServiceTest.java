package com.example.trains.service;

import com.example.trains.dto.ScheduleDTO;
import com.example.trains.model.Route;
import com.example.trains.model.Schedule;
import com.example.trains.model.Train;
import com.example.trains.repository.RouteRepository;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.TrainRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ScheduleServiceTest {

    private ScheduleRepository scheduleRepository;
    private TrainRepository trainRepository;
    private RouteRepository routeRepository;

    private ScheduleService scheduleService;

    @BeforeEach
    void setup() {
        scheduleRepository = mock(ScheduleRepository.class);
        trainRepository = mock(TrainRepository.class);
        routeRepository = mock(RouteRepository.class);

        scheduleService = new ScheduleService(
                scheduleRepository,
                trainRepository,
                routeRepository
        );
    }

    @Test
    void shouldCreateScheduleSuccessfully() {

        ScheduleDTO dto = new ScheduleDTO();

        dto.setTrainId(1);
        dto.setRouteId(1);

        dto.setDepartureTime(
                LocalDateTime.of(2026, 1, 1, 10, 0)
        );

        dto.setArrivalTime(
                LocalDateTime.of(2026, 1, 1, 15, 0)
        );

        Train train = new Train();
        train.setId(1);

        Route route = new Route();
        route.setId(1);

        when(trainRepository.findById(1))
                .thenReturn(Optional.of(train));

        when(routeRepository.findById(1))
                .thenReturn(Optional.of(route));

        when(scheduleRepository.findConflictingSchedules(
                any(),
                any(),
                any()
        )).thenReturn(List.of());

        Schedule saved = new Schedule();
        saved.setId(1);
        saved.setTrain(train);
        saved.setRoute(route);
        saved.setDepartureTime(dto.getDepartureTime());
        saved.setArrivalTime(dto.getArrivalTime());

        when(scheduleRepository.save(any()))
                .thenReturn(saved);

        ScheduleDTO result = scheduleService.createSchedule(dto);

        assertNotNull(result);
        assertEquals(1, result.getTrainId());
    }

    @Test
    void shouldThrowIfDepartureAfterArrival() {

        ScheduleDTO dto = new ScheduleDTO();

        dto.setDepartureTime(
                LocalDateTime.of(2026, 1, 1, 20, 0)
        );

        dto.setArrivalTime(
                LocalDateTime.of(2026, 1, 1, 10, 0)
        );

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> scheduleService.createSchedule(dto)
        );

        assertEquals(
                "Departure must be before arrival",
                ex.getMessage()
        );
    }

    @Test
    void shouldThrowIfTrainBusy() {

        ScheduleDTO dto = new ScheduleDTO();

        dto.setTrainId(1);
        dto.setRouteId(1);

        dto.setDepartureTime(
                LocalDateTime.of(2026, 1, 1, 10, 0)
        );

        dto.setArrivalTime(
                LocalDateTime.of(2026, 1, 1, 15, 0)
        );

        Train train = new Train();
        train.setId(1);

        Route route = new Route();
        route.setId(1);

        when(trainRepository.findById(1))
                .thenReturn(Optional.of(train));

        when(routeRepository.findById(1))
                .thenReturn(Optional.of(route));

        Schedule existing = new Schedule();
        existing.setId(99);

        when(scheduleRepository.findConflictingSchedules(
                any(),
                any(),
                any()
        )).thenReturn(List.of(existing));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> scheduleService.createSchedule(dto)
        );

        assertEquals(
                "Train is busy at this time",
                ex.getMessage()
        );
    }
}