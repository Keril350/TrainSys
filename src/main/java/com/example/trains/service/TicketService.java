package com.example.trains.service;

import com.example.trains.dto.TicketDTO;
import com.example.trains.model.Schedule;
import com.example.trains.model.Seat;
import com.example.trains.model.Ticket;
import com.example.trains.model.User;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.SeatRepository;
import com.example.trains.repository.TicketRepository;
import com.example.trains.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         ScheduleRepository scheduleRepository,
                         SeatRepository seatRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
    }

    // CREATE
    public TicketDTO createTicket(TicketDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Seat seat = seatRepository.findById(dto.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // 🔥 важная проверка — место принадлежит поезду
        if (!seat.getTrain().getId().equals(schedule.getTrain().getId())) {
            throw new RuntimeException("Seat does not belong to this train");
        }

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setSchedule(schedule);
        ticket.setSeat(seat);
        ticket.setPrice(dto.getPrice());
        ticket.setPurchaseDate(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // GET BY ID
    public Optional<TicketDTO> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(this::mapToDTO);
    }

    // GET BY USER
    public List<TicketDTO> getTicketsByUserId(Integer userId) {
        return ticketRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public TicketDTO updateTicket(Integer id, TicketDTO dto) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Seat seat = seatRepository.findById(dto.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // 🔥 проверка: место принадлежит поезду
        if (!seat.getTrain().getId().equals(schedule.getTrain().getId())) {
            throw new RuntimeException("Seat does not belong to this train");
        }

        // 🔥 проверка: место уже занято (кроме текущего билета)
        boolean seatTaken = ticketRepository
                .findByScheduleId(dto.getScheduleId())
                .stream()
                .anyMatch(t ->
                        t.getSeat().getId().equals(dto.getSeatId()) &&
                                !t.getId().equals(id)
                );

        if (seatTaken) {
            throw new RuntimeException("Seat already taken for this schedule");
        }

        // обновление
        ticket.setUser(user);
        ticket.setSchedule(schedule);
        ticket.setSeat(seat);
        ticket.setPrice(dto.getPrice());

        // ❗ purchaseDate НЕ меняем (логично)
        // ticket.setPurchaseDate(...)

        Ticket updated = ticketRepository.save(ticket);

        return mapToDTO(updated);
    }

    // DELETE
    public void deleteTicket(Integer id) {
        ticketRepository.deleteById(id);
    }

    // MAPPER
    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setUserId(ticket.getUser().getId());
        dto.setScheduleId(ticket.getSchedule().getId());
        dto.setSeatId(ticket.getSeat().getId());
        dto.setPrice(ticket.getPrice());
        dto.setPurchaseDate(ticket.getPurchaseDate());
        return dto;
    }
}