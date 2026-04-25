package com.example.trains.service;

import com.example.trains.dto.SeatDTO;
import com.example.trains.model.*;
import com.example.trains.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final ScheduleRepository scheduleRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final WagonRepository wagonRepository;

    public SeatService(ScheduleRepository scheduleRepository,
                       TicketRepository ticketRepository,
                       SeatRepository seatRepository,
                       WagonRepository wagonRepository) {
        this.scheduleRepository = scheduleRepository;
        this.ticketRepository = ticketRepository;
        this.seatRepository = seatRepository;
        this.wagonRepository = wagonRepository;
    }

    // CREATE
    public SeatDTO createSeat(SeatDTO dto) {

        Wagon wagon = wagonRepository.findById(dto.getWagonId())
                .orElseThrow(() -> new RuntimeException("Wagon not found"));

        // 🔥 проверка типа поезда
        if (wagon.getTrain().getType().getName().equalsIgnoreCase("Cargo")) {
            throw new RuntimeException("Cargo train cannot have seats");
        }

        Seat seat = new Seat();
        seat.setWagon(wagon);
        seat.setNumber(dto.getNumber());

        Seat saved = seatRepository.save(seat);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // GET BY WAGON
    public List<SeatDTO> getSeatsByWagonId(Integer wagonId) {
        return seatRepository.findByWagonId(wagonId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // 🔥 ВАЖНО — теперь логика через поезд → вагоны → места
    public List<SeatDTO> getAvailableSeats(Integer scheduleId) {

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Integer trainId = schedule.getTrain().getId();

        // 1. все вагоны поезда
        List<Wagon> wagons = wagonRepository.findByTrainId(trainId);

        // 2. все места из всех вагонов
        List<Seat> allSeats = wagons.stream()
                .flatMap(w -> seatRepository.findByWagonId(w.getId()).stream())
                .toList();

        // 3. занятые
        List<Ticket> tickets = ticketRepository.findByScheduleId(scheduleId);

        List<Integer> takenSeatIds = tickets.stream()
                .map(t -> t.getSeat().getId())
                .toList();

        // 4. фильтр
        return allSeats.stream()
                .filter(seat -> !takenSeatIds.contains(seat.getId()))
                .map(this::mapToDTO)
                .toList();
    }

    public List<SeatDTO> getTakenSeats(Integer scheduleId) {

        scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        List<Ticket> tickets = ticketRepository.findByScheduleId(scheduleId);

        return tickets.stream()
                .map(Ticket::getSeat)
                .map(this::mapToDTO)
                .toList();
    }

    // UPDATE
    public SeatDTO updateSeat(Integer id, SeatDTO dto) {

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        Wagon wagon = wagonRepository.findById(dto.getWagonId())
                .orElseThrow(() -> new RuntimeException("Wagon not found"));

        seat.setWagon(wagon);
        seat.setNumber(dto.getNumber());

        Seat updated = seatRepository.save(seat);

        return mapToDTO(updated);
    }

    // DELETE
    public void deleteSeat(Integer id) {
        seatRepository.deleteById(id);
    }

    // MAPPER
    private SeatDTO mapToDTO(Seat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        dto.setWagonId(seat.getWagon().getId());
        dto.setNumber(seat.getNumber());
        return dto;
    }
}