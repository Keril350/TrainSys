package com.example.trains.service;

import com.example.trains.dto.SeatDTO;
import com.example.trains.model.Schedule;
import com.example.trains.model.Seat;
import com.example.trains.model.Ticket;
import com.example.trains.model.Train;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.SeatRepository;
import com.example.trains.repository.TicketRepository;
import com.example.trains.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final ScheduleRepository scheduleRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final TrainRepository trainRepository;

    public SeatService(ScheduleRepository scheduleRepository, TicketRepository ticketRepository, SeatRepository seatRepository, TrainRepository trainRepository) {
        this.scheduleRepository = scheduleRepository;
        this.ticketRepository = ticketRepository;
        this.seatRepository = seatRepository;
        this.trainRepository = trainRepository;
    }

    // CREATE
    public SeatDTO createSeat(SeatDTO dto) {

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (train.getType().getName().equalsIgnoreCase("Cargo")) {
            throw new RuntimeException("Cargo train cannot have seats");
        }

        Seat seat = new Seat();
        seat.setTrain(train);
        seat.setNumber(dto.getNumber());

        Seat saved = seatRepository.save(seat);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY TRAIN
    public List<SeatDTO> getSeatsByTrainId(Integer trainId) {
        return seatRepository.findByTrainId(trainId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<SeatDTO> getTakenSeats(Integer scheduleId) {

        // 1. проверка schedule
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // 2. получаем билеты
        List<Ticket> tickets = ticketRepository.findByScheduleId(scheduleId);

        // 3. достаем места
        return tickets.stream()
                .map(ticket -> ticket.getSeat())
                .map(this::mapToDTO)
                .toList();
    }

    public List<SeatDTO> getAvailableSeats(Integer scheduleId) {

        // 1. получаем schedule
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Integer trainId = schedule.getTrain().getId();

        // 2. все места поезда
        List<Seat> allSeats = seatRepository.findByTrainId(trainId);

        // 3. занятые места
        List<Ticket> tickets = ticketRepository.findByScheduleId(scheduleId);

        List<Integer> takenSeatIds = tickets.stream()
                .map(ticket -> ticket.getSeat().getId())
                .toList();

        // 4. фильтруем
        return allSeats.stream()
                .filter(seat -> !takenSeatIds.contains(seat.getId()))
                .map(this::mapToDTO)
                .toList();
    }

    // UPDATE
    public SeatDTO updateSeat(Integer id, SeatDTO dto) {

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        seat.setTrain(train);
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
        dto.setTrainId(seat.getTrain().getId());
        dto.setNumber(seat.getNumber());
        return dto;
    }
}