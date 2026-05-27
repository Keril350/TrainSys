package com.example.trains.service;

import com.example.trains.dto.StatisticsDTO;
import com.example.trains.model.Ticket;
import com.example.trains.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final TrainRepository trainRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final TicketRepository ticketRepository;

    public StatisticsService(
            TrainRepository trainRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            TicketRepository ticketRepository
    ) {
        this.trainRepository = trainRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.ticketRepository = ticketRepository;
    }

    public StatisticsDTO getStatistics() {

        StatisticsDTO dto = new StatisticsDTO();

        dto.setTrainsCount(trainRepository.count());
        dto.setRoutesCount(routeRepository.count());
        dto.setSchedulesCount(scheduleRepository.count());
        dto.setTicketsCount(ticketRepository.count());

        List<Ticket> tickets = ticketRepository.findAll();

        // общая выручка
        BigDecimal revenue = tickets.stream()
                .map(Ticket::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalRevenue(revenue);

        // популярный маршрут
        Map<String, Long> routeStats = tickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getSchedule().getRoute().getName(),
                        Collectors.counting()
                ));

        String popularRoute = routeStats.entrySet()
                .stream()
                .max(Comparator.comparing(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse("—");

        dto.setMostPopularRoute(popularRoute);

        return dto;
    }
}